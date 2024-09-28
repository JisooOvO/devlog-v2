import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { user: process.env.GITHUB_EMAILS },
    { status: 200 },
  );
}
