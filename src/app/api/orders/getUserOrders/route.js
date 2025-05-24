import { getUserId } from "@/app/lib/getUserId";
import Orders from "@/app/models/orders";
import { unauthorized } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getUserId()
    
    if(!user){
        return NextResponse.json({
            unauthorized:true
        })
    }
    try{
        const orders = await Orders.find({ user: user.userId }).populate("items.product");
         
    const formattedOrders = orders.map(order => ({
        orderId: order._id,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price, 
        }))
      }));

      return NextResponse.json({
        success: true,
        orders: formattedOrders,
      });
    }
    catch(error){
        return NextResponse.json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
          }, { status: 500 });
    }
}