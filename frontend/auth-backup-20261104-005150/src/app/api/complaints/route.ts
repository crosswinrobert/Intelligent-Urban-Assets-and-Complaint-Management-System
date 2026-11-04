import {NextResponse} from "next/server";
import pool from "@/lib/db";
import {getEmbedding} from "@/lib/vector";
import {getCurrentUser} from "@/lib/auth";
const unauth=()=>NextResponse.json({success:false,error:"Unauthorized."},{status:401});
export async function GET(){
 const user=await getCurrentUser(); if(!user)return unauth();
 try{
  let where="",params:number[]=[];
  if(user.Role==="Citizen"){where="WHERE c.user_id=?";params=[user.user_id];}
  if(user.Role==="Staff"){where="WHERE EXISTS(SELECT 1 FROM complaint_assignments mine JOIN staff ms ON ms.staff_id=mine.staff_id WHERE mine.complaint_id=c.complaint_id AND ms.user_id=?)";params=[user.user_id];}
  const [complaints]=await pool.query(`SELECT c.complaint_id,c.Category,c.RawDescription,c.Lat,c.\`Long\`,c.UrgencyScore,c.PhotoURL,c.SubmittedAt,c.ResolvedAt,c.UpdatedAt,c.user_id,c.asset_id,c.status_id,cs.Status AS current_status,u.Fname AS citizen_fname,u.Lname AS citizen_lname,u.Email AS citizen_email,a.AssetName,ca.staff_id,ca.AssignedAt,ca.CompletedAt FROM complaint c JOIN complaint_status cs ON cs.status_id=c.status_id JOIN user u ON u.user_id=c.user_id LEFT JOIN asset a ON a.asset_id=c.asset_id LEFT JOIN complaint_assignments ca ON ca.complaint_id=c.complaint_id ${where} ORDER BY c.SubmittedAt DESC`,params);
  return NextResponse.json({success:true,complaints});
 }catch(e){console.error(e);return NextResponse.json({success:false,error:"Unable to retrieve complaints."},{status:500});}
}
export async function POST(req:Request){
 const user=await getCurrentUser();if(!user)return unauth();
 if(user.Role!=="Citizen")return NextResponse.json({success:false,error:"Only citizens can submit complaints."},{status:403});
 let conn:Awaited<ReturnType<typeof pool.getConnection>>|undefined,started=false;
 try{
  const b=await req.json(),category=String(b.category||"General").trim(),description=String(b.raw_description||"").trim(),urgency=b.urgency_score==null?3:Number(b.urgency_score),lat=b.lat==null||b.lat===""?null:Number(b.lat),lng=b.long==null||b.long===""?null:Number(b.long);
  if(!category||!description)return NextResponse.json({success:false,error:"Category and description are required."},{status:400});
  if(!Number.isFinite(urgency)||urgency<1||urgency>5||(lat!==null&&!Number.isFinite(lat))||(lng!==null&&!Number.isFinite(lng)))return NextResponse.json({success:false,error:"Invalid urgency or coordinates."},{status:400});
  const embedding=JSON.stringify(await getEmbedding(category+". "+description));conn=await pool.getConnection();await conn.beginTransaction();started=true;
  const [result]:any=await conn.execute("INSERT INTO complaint(user_id,Category,RawDescription,Lat,`Long`,PhotoURL,asset_id,status_id,UrgencyScore,Embedding) VALUES(?,?,?,?,?,?,?,1,?,?)",[user.user_id,category,description,lat,lng,b.photo_url||null,b.asset_id||null,urgency,embedding]);
  await conn.commit();started=false;return NextResponse.json({success:true,complaint_id:result.insertId},{status:201});
 }catch(e){if(conn&&started)await conn.rollback();console.error(e);return NextResponse.json({success:false,error:"Unable to submit complaint."},{status:500});}finally{conn?.release();}
}
export async function PATCH(req:Request){
 const user=await getCurrentUser();if(!user)return unauth();
 if(user.Role==="Citizen")return NextResponse.json({success:false,error:"Forbidden."},{status:403});
 try{
  const b=await req.json(),id=Number(b.complaint_id),status=String(b.status||""),urgency=b.urgency_score===undefined?null:Number(b.urgency_score);
  if(!Number.isInteger(id)||id<=0)return NextResponse.json({success:false,error:"Valid complaint_id required."},{status:400});
  if(user.Role==="Staff"){const [a]:any=await pool.execute("SELECT ca.assignment_id FROM complaint_assignments ca JOIN staff s ON s.staff_id=ca.staff_id WHERE ca.complaint_id=? AND s.user_id=? AND ca.CompletedAt IS NULL",[id,user.user_id]);if(!a.length)return NextResponse.json({success:false,error:"Not assigned to you."},{status:403});}
  if(urgency!==null&&(!Number.isFinite(urgency)||urgency<1||urgency>5))return NextResponse.json({success:false,error:"Urgency must be 1â€“5."},{status:400});
  if(urgency!==null&&user.Role!=="Admin")return NextResponse.json({success:false,error:"Only administrators can change urgency."},{status:403});
  if(status){const [s]:any=await pool.execute("SELECT status_id FROM complaint_status WHERE Status=?",[status]);if(!s.length)return NextResponse.json({success:false,error:"Unknown status."},{status:400});if(status==="Resolved")await pool.query("CALL sp_resolve_complaint(?)",[id]);else await pool.execute("UPDATE complaint SET status_id=? WHERE complaint_id=?",[s[0].status_id,id]);}
  if(urgency!==null)await pool.execute("UPDATE complaint SET UrgencyScore=? WHERE complaint_id=?",[urgency,id]);
  if(!status&&urgency===null)return NextResponse.json({success:false,error:"No update supplied."},{status:400});
  return NextResponse.json({success:true});
 }catch(e){console.error(e);return NextResponse.json({success:false,error:"Unable to update complaint."},{status:500});}
}
