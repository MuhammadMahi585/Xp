import Product from "@/app/models/products";
import dbConnect from "@/app/lib/db";
import { getUserId } from "@/app/lib/getUserId";
import Orders from "@/app/models/orders";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await dbConnect();

  try {
    const { orderId, status } = await request.json();

    const user = await getUserId();
    if (!user) {
      return NextResponse.json({ unauthorized: true }, { status: 401 });
    }

    const existingOrder = await Orders.findById(orderId).populate("items.product");
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = existingOrder.status;


    if (status === "cancelled" && previousStatus !== "cancelled") {
      await Promise.all(
        existingOrder.items.map((item) =>
          Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: item.quantity },
          })
        )
      );
    }


    if (previousStatus === "cancelled" && status !== "cancelled") {
      await Promise.all(
        existingOrder.items.map((item) =>
          Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity },
          })
        )
      );
    }

    const updatedOrder = await Orders.findOneAndUpdate(
      { _id: orderId },
      { status },
      { new: true }
    );

    return NextResponse.json({ success: true, updatedOrder }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
