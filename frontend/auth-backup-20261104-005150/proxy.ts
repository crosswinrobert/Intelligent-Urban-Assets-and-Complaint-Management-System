import {NextRequest,NextResponse} from "next/server";
const COOKIE="urban_pulse_session";
function decode64(value:string):Uint8Array{
 const raw=atob(value.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(value.length/4)*4,"="));
 const out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;
}
async function session(token:string){
 try{
  const secret=process.env.SESSION_SECRET;if(!secret||secret.length<64)return null;
  const parts=token.split(".");if(parts.length!==2)return null;
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
  const sig=decode64(parts[1]);const sigBuffer=new ArrayBuffer(sig.byteLength);new Uint8Array(sigBuffer).set(sig);
  const valid=await crypto.subtle.verify("HMAC",key,sigBuffer,new TextEncoder().encode(parts[0]));if(!valid)return null;
  const data=JSON.parse(new TextDecoder().decode(decode64(parts[0])));
  if(!data.exp||data.exp<=Math.floor(Date.now()/1000)||!Number.isInteger(data.user_id)||!["Admin","Citizen","Staff"].includes(data.Role))return null;
  return data as {Role:"Admin"|"Citizen"|"Staff"};
 }catch{return null;}
}
export async function proxy(request:NextRequest){
 const path=request.nextUrl.pathname;
 if(path==="/login"||path==="/api/auth/login"||path==="/api/auth/logout"||path.startsWith("/_next/")||path==="/favicon.ico")return NextResponse.next();
 const token=request.cookies.get(COOKIE)?.value;const user=token?await session(token):null;
 if(!user){
  if(path.startsWith("/api/"))return NextResponse.json({success:false,error:"Unauthorized."},{status:401});
  const url=new URL("/login",request.url);url.searchParams.set("next",path);return NextResponse.redirect(url);
 }
 const home=user.Role==="Admin"?"/admin/dashboard":user.Role==="Staff"?"/worker/dashboard":"/citizen/dashboard";
 if(path==="/")return NextResponse.redirect(new URL(home,request.url));
 let required:"Admin"|"Staff"|"Citizen"|null=null;
 if(path==="/admin"||path.startsWith("/admin/"))required="Admin";
 else if(path==="/worker"||path.startsWith("/worker/"))required="Staff";
 else if(path==="/citizen"||path.startsWith("/citizen/"))required="Citizen";
 else if(["/api/dashboard","/api/assets","/api/departments"].some(p=>path===p||path.startsWith(p+"/")))required="Admin";
 else if(["/api/assignments","/api/resolutions"].some(p=>path===p||path.startsWith(p+"/")))required="Staff";
 if(required&&user.Role!==required&&!(user.Role==="Admin"&&required!=="Admin")){
  if(path.startsWith("/api/"))return NextResponse.json({success:false,error:"Forbidden."},{status:403});
  return NextResponse.redirect(new URL(home,request.url));
 }
 return NextResponse.next();
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};
