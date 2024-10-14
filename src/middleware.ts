import { getToken } from "next-auth/jwt";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import checkAuth from "@/lib/functions/checkAuth";

const middleware = async (req: NextRequest) => {
  const nextUrl = req.nextUrl.pathname;
  if (nextUrl.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token && token.email) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      if (!checkAuth(token?.email)) {
        return NextResponse.json({ message: "인증 실패" }, { status: 401 });
      }
    }

    if (await checkAuth(token.email)) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(
    new URL(`${process.env.SERVER_URL}/unauthorized`)
  );
};

export const config: MiddlewareConfig = {
  matcher: [
    "/api/series",
    "/api/topics",
    "/api/thumbnails",
    "/api/upload",
    "/manage/:path*",
    "/write/:path*",
  ],
};

// const middleware = () => {};

export default middleware;
