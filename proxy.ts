import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = request.nextUrl.clone();

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!token && request.nextUrl.pathname.startsWith("/resetpass")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token && request.nextUrl.pathname === "/login") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/", "/resetpass", "/dashboard/:path*"],
};
