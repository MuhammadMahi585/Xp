import {getUserId} from "@/app/lib/getUserId"
import dbConnect from "@/app/lib/db"
import User from "@/app/models/user"
import { unauthorized } from "next/navigation"
import { NextResponse } from "next/server"

export async function POST(request) {
    await dbConnect();
    const {productId,quantity} = await request.json()

    const user= await getUserId()

    if(!user){
        return NextResponse.json(
            {unauthorized:true},
            {status:401}
        )
    }
    const res= await User.findOne({
        _id:user.userId,
        "cart.product":productId
    })

    if(res){
        const existingItem = res.cart.find(item => item.product.toString() === productId);
        const newQuantity = (existingItem?.quantity || 0) + (quantity || 1);
    
    await User.updateOne(
        {_id:user.userId,"cart.product":productId},
        {$set:{"cart.$.quantity":newQuantity}}
    )
   }
    else{
    await User.findByIdAndUpdate(user.userId,{
     $push:{cart:{
        product:productId,
        quantity:quantity || 1}}
    })}
   

    return NextResponse.json({
     success:true 
    })

}