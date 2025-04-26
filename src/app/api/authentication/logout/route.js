import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    cookies().delete("token"); // no await here!
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Logout Failed" },
      { status: 500 }
    );
  }
}
