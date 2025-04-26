import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({
      isAuthenticated: true,
      role: decoded.type, 
    });
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
}
