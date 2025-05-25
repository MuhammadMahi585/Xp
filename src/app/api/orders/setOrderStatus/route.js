import { getUserId } from "@/app/lib/getUserId"
import Orders from "@/app/models/orders";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { orderId, status } = await request.json();

    const user = await getUserId();
    if (!user) {
      return NextResponse.json({ unauthorized: true }, { status: 401 });
    }

    const updatedOrder = await Orders.findOneAndUpdate(
      { _id: orderId },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, updatedOrder }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
