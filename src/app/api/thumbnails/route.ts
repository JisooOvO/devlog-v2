import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const thumbnails = await prisma.thumbnail.findMany();
  return NextResponse.json({ thumbnails }, { status: 200 });
}
