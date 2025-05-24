import dbConnect from "@/app/lib/db";
import { getUserId } from "@/app/lib/getUserId";
import Orders from "@/app/models/orders";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const user = await getUserId();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { shippingAddress, totalAmount } = await req.json();
    const userData = await User.findById(user.userId).populate("cart.product");

    if (!userData || !userData.cart || userData.cart.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    const order = await Orders.create({
      user: user.userId,
      items: userData.cart,
      shippingAddress,
      totalAmount,
    });

    await User.findByIdAndUpdate(user.userId, {
      $push: { orders: order._id },
      $set: { cart: [] },
    });

    return NextResponse.json({
      success: true,
      message: "Order added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
