import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json(
      { message: "authorization failed" },
      { status: 401 }
    );
  }

  const topics = await prisma.topic.findMany({
    select: {
      name: true,
      series: {
        select: {
          name: true,
        },
      },
    },
  });
  return NextResponse.json({ topics }, { status: 200 });
}
