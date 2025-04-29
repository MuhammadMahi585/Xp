import {getUserId} from "@/app/lib/getUserId"
import dbConnect from "@/app/lib/db"
import User from "@/app/models/user"
import { unauthorized } from "next/navigation"
import { NextResponse } from "next/server"

export async function POST(request) {
    await dbConnect();
    const {productId} = await request.json()

    const user= getUserId()

    if(!User){
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
        return NextResponse.json({
            alreadyExist:true
        })
    }
    await User.findByIdAndUpdate(user.userId,{
     $push:{cart:{product:productId}}
    })

    return NextResponse.json({
     success:true 
    })

}