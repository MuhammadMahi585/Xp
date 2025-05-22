import { getUserId } from "@/app/lib/getUserId";
import User from "@/app/models/user";
import { unauthorized } from "next/navigation";
import { NextResponse } from "next/server";
export async function GET() {
    const token = await getUserId();
    
    if(!token){
        return NextResponse.json(
            {unauthorized:true}
        )
    }
    try{
      const foundedUser= await User.findById(token.userId).lean()
      return NextResponse.json(
        {success:true,
            user:foundedUser
        }
      )
    }   
    catch(err){
       console.log("unable to find a user",err)
    }
}