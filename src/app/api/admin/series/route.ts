import customResponse from "@/lib/constants/customResponse";
import prisma from "@/lib/utils/prisma";
import { Series } from "@prisma/client";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const { series }: { series: Series } = await req.json();

  try {
    if (series) {
      const deletedSeries = await prisma.series.delete({
        where: {
          id: series.id,
        },
      });

      return customResponse(
        {
          success: true,
          message: "시리즈가 성공적으로 삭제되었습니다.",
          data: deletedSeries.name,
        },
        { status: 200 }
      );
    }
  } catch {
    return customResponse(
      { success: false, message: "시리즈 삭제에 실패하였습니다." },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------

export async function PUT(req: NextRequest) {
  const { series }: { series: Series } = await req.json();

  try {
    if (series) {
      const updatedSeries = await prisma.series.update({
        where: {
          id: series.id,
        },
        data: {
          name: series.name,
          updatedAt: new Date(),
        },
      });

      return customResponse(
        {
          success: true,
          message: "시리즈가 성공적으로 수정되었습니다.",
          data: updatedSeries.name,
        },
        { status: 200 }
      );
    }
  } catch {
    return customResponse(
      { success: false, message: "시리즈 수정에 실패하였습니다." },
      { status: 500 }
    );
  }
}
