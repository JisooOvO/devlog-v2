import customResponse from "@/lib/constants/customResponse";
import prisma from "@/lib/utils/prisma";
import { NextRequest } from "next/server";
import { defaultCommentTake } from "@/lib/constants/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const postId = searchParams.get("postId");

  if (postId) {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      return customResponse(
        { success: false, message: "댓글 요청에 실패하였습니다." },
        { status: 500 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: post?.id,
      },
      select: {
        id: true,
        content: true,
        user: true,
        createdAt: true,
      },
      skip: defaultCommentTake * (page - 1),
      take: defaultCommentTake * page,
    });

    const maximum = await prisma.comment.count({
      where: {
        postId: post?.id,
      },
    });

    return customResponse(
      { success: true, data: { comments, maximum } },
      { status: 200 }
    );
  }

  return customResponse(
    { success: false, message: "댓글 요청에 실패하였습니다." },
    { status: 500 }
  );
}
