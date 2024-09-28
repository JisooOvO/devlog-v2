import { getToken } from "next-auth/jwt";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import checkAuth from "./lib/func/checkAuth";

const middleware = async (req: NextRequest) => {
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token && token.email) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      if (!checkAuth(token?.email)) {
        return NextResponse.json(
          { message: "authorization failed" },
          { status: 401 },
        );
      }
    }

    if (await checkAuth(token.email)) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(
    new URL(`${process.env.SERVER_URL}/unauthorized`),
  );
};

export const config: MiddlewareConfig = {
  matcher: ["/api/:path*", "/manage/:path*", "/write/:path*"],
};

// const middleware = () => {};

export default middleware;
