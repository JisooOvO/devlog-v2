import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { user: process.env.GITHUB_EMAILS },
    { status: 200 }
  );
}

// --------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email)
    return NextResponse.json(
      { message: "로그인 후 이용 가능합니다." },
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

    return NextResponse.json({ role: user?.role?.name }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
