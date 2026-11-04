import {NextResponse} from "next/server";
import pool from "@/lib/db";
export async function GET(){try{const [rows]=await pool.query(`SELECT c.citizen_id,u.user_id,u.Fname,u.Lname,u.Email,u.Address,(SELECT GROUP_CONCAT(p.PhoneNumber SEPARATOR ", ") FROM user_phone p WHERE p.user_id=u.user_id) phone FROM citizen c JOIN user u ON u.user_id=c.user_id ORDER BY u.Fname,u.Lname`);return NextResponse.json({success:true,citizens:rows});}catch(error){console.error("Citizens API:",error);return NextResponse.json({success:false,error:"Unable to retrieve citizen records."},{status:500});}}
