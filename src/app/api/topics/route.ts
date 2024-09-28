import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
