import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json(
      { message: "authorization failed" },
      { status: 401 },
    );
  }

  const thumbnails = await prisma.thumbnail.findMany();
  return NextResponse.json({ thumbnails }, { status: 200 });
}
