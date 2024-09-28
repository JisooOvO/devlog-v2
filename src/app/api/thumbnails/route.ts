import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const thumbnails = await prisma.thumbnail.findMany();
  return NextResponse.json({ thumbnails }, { status: 200 });
}
