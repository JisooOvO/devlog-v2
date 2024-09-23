import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const series = await prisma.series.findMany();
  return NextResponse.json({ series }, { status: 200 });
}
