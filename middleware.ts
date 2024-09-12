import { getToken } from "next-auth/jwt";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const middleware = async (req: NextRequest) => {
  console.log("this is middleware");

  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token && token.email) {
    const authEmails = process.env.GITHUB_EMAILS?.split(",");
    if (authEmails?.includes(token.email)) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(
    new URL(`${process.env.SERVER_URL}/unauthorized`)
  );
};

export const config: MiddlewareConfig = {
  matcher: ["/api/:path*", "/write/:path*"],
};

export default middleware;
