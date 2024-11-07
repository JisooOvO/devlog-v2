import customResponse from "@/lib/constants/customResponse";
import prisma from "@/lib/utils/prisma";
import { Topic } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      select: {
        name: true,
        series: {
          select: {
            name: true,
          },
        },
      },
    });

    return customResponse({ success: true, data: topics }, { status: 200 });
  } catch {
    return customResponse(
      { success: false, message: "토픽 조회에 실패하였습니다." },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const { topics }: { topics: Topic } = await req.json();

  try {
    if (topics) {
      const deletedTopics = await prisma.topic.delete({
        where: {
          id: topics.id,
        },
      });

      return customResponse(
        {
          success: true,
          message: "토픽이 성공적으로 삭제되었습니다.",
          data: deletedTopics.name,
        },
        { status: 200 }
      );
    }
  } catch {
    return customResponse(
      { success: false, message: "토픽 삭제에 실패하였습니다." },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------

export async function PUT(req: NextRequest) {
  const { topics }: { topics: Topic } = await req.json();

  try {
    if (topics) {
      const updatedTopics = await prisma.topic.update({
        where: {
          id: topics.id,
        },
        data: {
          name: topics.name,
          updatedAt: new Date(),
        },
      });

      return customResponse(
        {
          success: true,
          message: "토픽이 성공적으로 수정되었습니다.",
          data: updatedTopics.name,
        },
        { status: 200 }
      );
    }
  } catch {
    return customResponse(
      { success: false, message: "토픽 수정에 실패하였습니다." },
      { status: 500 }
    );
  }
}
