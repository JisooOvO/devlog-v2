import customResponse from "@/lib/constants/customResponse";
import prisma from "@/lib/utils/prisma";
import { Thumbnail } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const thumbnails = await prisma.thumbnail.findMany();
    return customResponse({ success: true, data: thumbnails }, { status: 200 });
  } catch {
    return customResponse(
      { success: false, message: "썸네일 조회에 실패하였습니다." },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const { thumbnails }: { thumbnails: Thumbnail } = await req.json();

  try {
    if (thumbnails) {
      const deletedThumb = await prisma.thumbnail.delete({
        where: {
          id: thumbnails.id,
        },
      });

      return customResponse(
        {
          success: true,
          message: "썸네일이 성공적으로 삭제되었습니다.",
          data: deletedThumb.name,
        },
        { status: 200 }
      );
    }
  } catch {
    return customResponse(
      { success: false, message: "썸네일 삭제에 실패하였습니다." },
      { status: 500 }
    );
  }
}
