import dbConnect from "@/app/lib/db";
import { getUserId } from "@/app/lib/getUserId";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
   
    await dbConnect();

    
    const user = await getUserId();
  

    if (!user) {
  
      return NextResponse.json({ unauthorized: true }, { status: 401 });
    }


    const userDB = await User.findById(user.userId);
  

    const defaultAddress = userDB?.addresses?.[0];
    if (!defaultAddress) {
      
      return NextResponse.json({ success: false, error: "No address found" });
    }

  
    return NextResponse.json({
      success: true,
      address: {
        street: defaultAddress.street,
        city: defaultAddress.city,
        state: defaultAddress.state,
        postalCode: defaultAddress.postalCode,
        country: defaultAddress.country,
      },
    });
  } catch (err) {

    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
