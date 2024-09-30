import prisma from "@/lib/prisma";
import { Thumbnail } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const thumbnails = await prisma.thumbnail.findMany();
  return NextResponse.json({ thumbnails }, { status: 200 });
}

// --------------------------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const { thumbnails }: { thumbnails: Thumbnail } = await req.json();

  try {
    if (thumbnails) {
      await prisma.thumbnail.delete({
        where: {
          id: thumbnails.id,
        },
      });

      return NextResponse.json(
        { message: "성공적으로 삭제되었습니다." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "삭제에 실패하였습니다." },
      { status: 500 }
    );
  }
}
