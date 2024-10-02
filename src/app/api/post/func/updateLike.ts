import prisma from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const updateLike = async (token: JWT, req: NextRequest) => {
  try {
    const { id } = await prisma.user.findFirstOrThrow({
      where: {
        email: token.email,
      },
      select: {
        id: true,
      },
    });

    const { postId } = await req.clone().json();

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

    return NextResponse.json({ likes: post?._count.likes }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "수정에 실패하였습니다", error },
      { status: 500 }
    );
  }
};

export default updateLike;
