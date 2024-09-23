import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const topics = await prisma.topic.findMany();
  return NextResponse.json({ topics }, { status: 200 });
}
