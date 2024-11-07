import customResponse from "@/lib/constants/customResponse";
import prisma from "@/lib/utils/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  return customResponse(
    { success: true, data: process.env.GITHUB_EMAILS },
    { status: 200 }
  );
}

// --------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email)
    return customResponse(
      { success: false, message: "로그인 후 이용 가능합니다." },
      { status: 400 }
    );

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return customResponse(
      { success: true, data: user?.role?.name },
      { status: 200 }
    );
  } catch (error) {
    return customResponse(
      { success: false, message: "사용자 권한 탐색 중 에러 발생" },
      { status: 500 }
    );
  }
}
