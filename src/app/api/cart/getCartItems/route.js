import User from "@/app/models/user";
import { getUserId } from "@/app/lib/getUserId";
import dbConnect from "@/app/lib/db";
import { NextResponse } from "next/server";
import { unauthorized } from "next/navigation";
import Product from "@/app/models/products";

export async function GET(request) {
    await dbConnect()
    const user = await getUserId()

    if(!user){
        return NextResponse.json(
        {unauthorized:true },
        {status:401})

    }
    try{
    const customer = await User.findById(user.userId).populate("cart.product")

    if(!customer||customer.cart.length===0){
        return NextResponse.json(
            {isCartEmpty:true},
            {status:200}
        )
    }
   
    const cartProducts = customer.cart.map(item=>item.product)
   
    return NextResponse.json(
        {cartProducts,
        success:true},
        {status:200}
    )
}
catch(error){
    console.log("Error occur while retrieving cart data",error)
    return NextResponse.json(
        {error:true,
        message:error
        },
        {status:500})
}
}