import Cart from "@/app/components/customerComponents/cart/page";
import dbConnect from "@/app/lib/db";
import { getUserId } from "@/app/lib/getUserId";
import mongoose from "mongoose";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    await dbConnect();
    const {itemId} = await req.json()
    console.log("Deleting itemId:", itemId); 
    

    const user= await getUserId()

     if(!user){
            return NextResponse.json(
            {unauthorized:true },
            {status:401})
    
        }
    try{
        const objectId = new mongoose.Types.ObjectId(itemId);
       const result = await User.updateOne(
        {_id:user.userId},
        {$pull :{cart:{"product":objectId}}}
       )
       if(result.modifiedCount=== 0){
        return NextResponse.json({
            message:"Item not found"
        })
       }
       return NextResponse.json(
        {success:true}
       )
    }
    catch(err){
    console.error("Delete cart item error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
    
}