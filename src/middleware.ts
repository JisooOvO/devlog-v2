import { getToken } from "next-auth/jwt";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import checkAuth from "@/lib/utils/functions/checkAuth";
import customResponse from "./lib/constants/customResponse";

const middleware = async (req: NextRequest) => {
  const token = await getToken({ req });
  const nextUrl = req.nextUrl.pathname;

  if (token === null) {
    if (nextUrl.startsWith("/api")) {
      return customResponse(
        { success: false, message: "사용자 인증 실패" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL(`${process.env.SERVER_URL}/unauthorized`)
    );
  } else {
    if (nextUrl.startsWith("/api/admin")) {
      if (!(await checkAuth(token?.email))) {
        return customResponse(
          { success: false, message: "관리자 인증 실패" },
          { status: 401 }
        );
      } else {
        return NextResponse.next();
      }
    }

    if (nextUrl.startsWith("/admin")) {
      if (!(await checkAuth(token?.email))) {
        return NextResponse.redirect(
          new URL(`${process.env.SERVER_URL}/unauthorized`)
        );
      } else {
        return NextResponse.next();
      }
    }
  }
};

export const config: MiddlewareConfig = {
  matcher: ["/api/user/:path*", "/api/admin/:path*", "/admin/:path*"],
};

// const middleware = () => {};

export default middleware;
