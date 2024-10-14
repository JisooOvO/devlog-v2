import prisma from "@/lib/utils/prisma";
import { Topic } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
  return NextResponse.json({ topics }, { status: 200 });
}

// --------------------------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const { topics }: { topics: Topic } = await req.json();

  try {
    if (topics) {
      await prisma.topic.delete({
        where: {
          id: topics.id,
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
  const { topics }: { topics: Topic } = await req.json();

  try {
    if (topics) {
      await prisma.topic.update({
        where: {
          id: topics.id,
        },
        data: {
          name: topics.name,
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
