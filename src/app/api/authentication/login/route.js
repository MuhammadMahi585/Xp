import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import User from  "@/app/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
   await dbConnect();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

   
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

  
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" }, 
        { status: 401 }
      );
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, type: user.type }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" } 
    );
    
    (await cookies()).set("token",token,{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      sameSite: "strict",
      maxAge: 86400,
      path:"/",
    }); 
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        error: "Authentication failed",
        details: process.env.NODE_ENV === "development" ? error.message : null
      },
      { status: 500 }
    );
  }
}