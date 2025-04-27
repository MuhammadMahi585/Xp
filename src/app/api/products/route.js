import { NextResponse } from 'next/server';
import Product from '@/app/models/products';
import dbConnect from '@/app/lib/db';

// GET all products
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }

    const products = await Product.find(query);
    const categories = await Product.distinct('category');

    return NextResponse.json({ 
      success: true,
      data: products,
      categories: ['All', ...categories]
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const product = await Product.create(body);
    
    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function Delete({params}) {
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