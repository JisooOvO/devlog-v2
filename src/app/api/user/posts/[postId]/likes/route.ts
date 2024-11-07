import customResponse from "@/lib/constants/customResponse";
import prisma from "@/lib/utils/prisma";
import { apiRequestForLikeWhenPost } from "@/lib/types/apiRequest";
import { NextRequest } from "next/server";

interface postParams {
  params: {
    postId: string;
  };
}

export async function POST(req: NextRequest, { params }: postParams) {
  const { email }: apiRequestForLikeWhenPost = await req.json();
  const { postId } = params;

  try {
    const { id } = await prisma.user.findFirstOrThrow({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    const like = await prisma.likes.findFirst({
      where: {
        userId: id,
        postId: postId,
      },
    });

    let prismaLikeClient = !like
      ? prisma.likes.create({
          data: {
            userId: id,
            postId: postId,
          },
        })
      : prisma.likes.delete({
          where: {
            postId_userId: {
              userId: id,
              postId: postId,
            },
          },
        });

    const [_, post] = await prisma.$transaction([
      prismaLikeClient,
      prisma.post.findFirst({
        where: {
          id: postId,
        },
        select: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      }),
    ]);

    return customResponse(
      { success: true, data: post?._count.likes },
      { status: 200 }
    );
  } catch {
    return customResponse(
      { success: false, message: "좋아요 전송 중 오류 발생하였습니다." },
      { status: 500 }
    );
  }
}
