import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Allow authentication routes
  if (pathname.startsWith('/components/authentication')) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value; 

  if (!token) {
    return NextResponse.redirect(
      new URL('/components/authentication/login', request.url)
    );
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const isAdmin = payload.type === 'admin';
    const isCustomer = payload.type === 'customer';

    // Prevent customers from accessing admin dashboard
    if (pathname.startsWith('/components/dashboard/admin') && !isAdmin) {
      return NextResponse.redirect(
        new URL('/components/dashboard/customer', request.url)
      );
    }

    // Prevent admins from accessing customer dashboard
    if (pathname.startsWith('/components/dashboard/customer') && !isCustomer) {
      return NextResponse.redirect(
        new URL('/components/dashboard/admin', request.url)
      );
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid token or verification failed
    return NextResponse.redirect(
      new URL('/components/authentication/login', request.url)
    );
  }
}

export const config = {
  matcher: [
    '/components/dashboard/admin/:path*',
    '/components/dashboard/customer/:path*',
  ],
};
