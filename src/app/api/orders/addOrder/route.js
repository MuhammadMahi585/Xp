import Product from "@/app/models/products";
import dbConnect from "@/app/lib/db";
import { getUserId } from "@/app/lib/getUserId";
import Orders from "@/app/models/orders";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const user = await getUserId(req);
  if (!user)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const { shippingAddress, confirm } = await req.json();
    const userData = await User.findById(user.userId).populate("cart.product");

    if (!userData?.cart.length)
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });

    const cartAdjustments = [];
    const validItems = [];

    for (const item of userData.cart) {
      const prod = await Product.findById(item.product._id);

      if (!prod || prod.stock <= 0) {
        cartAdjustments.push({
          product: item.product._id.toString(),
          productName: item.product.name,
          status: "removed",
          message: `${item.product.name} was removed from your cart as it is out of stock.`,
        });
        continue;
      }

      if (item.quantity > prod.stock) {
        cartAdjustments.push({
          product: item.product._id.toString(),
          productName: item.product.name,
          status: "adjusted",
          oldQuantity: item.quantity,
          newQuantity: prod.stock,
          message: `${item.product.name} quantity adjusted from ${item.quantity} to ${prod.stock}.`,
        });
        validItems.push({ product: item.product._id, quantity: prod.stock });
      } else {
        validItems.push({ product: item.product._id, quantity: item.quantity });
      }
    }

    if (cartAdjustments.length && !confirm) {
      await User.findByIdAndUpdate(user.userId, {
        cart: validItems,
      });

      return NextResponse.json({
        success: false,
        adjustments: cartAdjustments,
        message: "Cart updated due to stock changes. Please confirm to proceed.",
      });
    }

    const orderItems = validItems.map(({ product, quantity }) => {
      const itemInCart = userData.cart.find(i => i.product._id.toString() === product.toString());
      return {
        product,
        name: itemInCart.product.name,
        priceAtPurchase: itemInCart.product.price,
        quantity,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, i) => sum + i.priceAtPurchase * i.quantity,
      0
    );

    const order = await Orders.create({
      user: user.userId,
      items: orderItems,
      shippingAddress,
      totalAmount,
    });

    await Promise.all(
      orderItems.map(i =>
        Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.quantity } })
      )
    );

    await User.findByIdAndUpdate(user.userId, {
      $push: { orders: order._id },
      $set: { cart: [] },
    });

    return NextResponse.json({ success: true, message: "Order placed successfully" });
  } catch (err) {
    console.error("Order Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
