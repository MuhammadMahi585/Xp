import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUserId(){
 const cookie = await cookies()
 const token = cookie.get('token')?.value
 
 if(!token) return null;

 try{
    const decoded= jwt.verify(token,process.env.JWT_SECRET)
    return decoded
 }
 catch(err){
    console.error("JWT verification failed:", err);
    return null;
 }

}