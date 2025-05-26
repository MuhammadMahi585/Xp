import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/user";
import dbConnect from "@/app/lib/db";

export async function POST(req) {
  await dbConnect();
  try {
    const { 
      name, 
      email, 
      password, 
      type = "admin",
      number,
      street,
      city,
      state,
      postalCode,
      country = "Pakistan"
    } = await req.json();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({  
      name,
      email,
      password: hashedPassword,
      type,
      number,
      addresses: [{
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: true
      }]
    });

    const { password: _, ...safeUser } = user.toObject();

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed", details: error.message },
      { status: 500 }
    );
  }
}