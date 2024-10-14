import prisma from "@/lib/utils/prisma";
import { Series } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { series }: { series: Series } = await req.json();

  try {
    if (series) {
      await prisma.series.delete({
        where: {
          id: series.id,
        },
      });

      return NextResponse.json(
        { message: "성공적으로 삭제되었습니다." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "삭제에 실패하였습니다.", error },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------

export async function PUT(req: NextRequest) {
  const { series }: { series: Series } = await req.json();

  try {
    if (series) {
      await prisma.series.update({
        where: {
          id: series.id,
        },
        data: {
          name: series.name,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(
        { message: "성공적으로 수정되었습니다." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "수정에 실패하였습니다.", error },
      { status: 500 }
    );
  }
}
