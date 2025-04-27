import { NextResponse } from 'next/server';
import Product from '@/app/models/products';
import dbConnect from '@/app/lib/db';
export async function DELETE(request,{params}) {
    try{
       await dbConnect();
       const {productId} = params
       
       const product= await Product.findByIdAndDelete(productId)
       if (!product) {
          return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
      }
       return NextResponse.json(
        {success:true},
        {data:product}
       )
    }
    catch(err){
        console.log("Failed to delete product",err)
        return NextResponse.json(
          {error:err}
        )
    }
}