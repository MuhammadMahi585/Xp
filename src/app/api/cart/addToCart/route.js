import { getUserId } from "@/app/lib/getUserId";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import Product from "@/app/models/products";

export async function POST(request) {
  await dbConnect();
  const { productId, quantity } = await request.json();

  const user = await getUserId();

  if (!user) {
    return NextResponse.json({ unauthorized: true }, { status: 401 });
  }


  const product = await Product.findById(productId);
  if (!product || product.stock < quantity) {
    return NextResponse.json({ ProductoutOfStock: true });
  }


  await Product.updateOne(
    { _id: productId },
    { $inc: { stock: -quantity } }
  );


  const userDoc = await User.findOne({
    _id: user.userId,
    "cart.product": productId,
  });

  if (userDoc) {
    const existingItem = userDoc.cart.find(
      (item) => item.product.toString() === productId
    );
    const newQuantity = (existingItem?.quantity || 0) + quantity;

    await User.updateOne(
      { _id: user.userId, "cart.product": productId },
      { $set: { "cart.$.quantity": newQuantity } }
    );
  } else {
  
    await User.findByIdAndUpdate(user.userId, {
      $push: {
        cart: {
          product: productId,
          quantity: quantity || 1,
        },
      },
    });
  }

  return NextResponse.json({ success: true });
}
