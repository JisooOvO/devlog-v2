import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json(
      { message: "authorization failed" },
      { status: 401 }
    );
  }

  try {
    const { id } = await prisma.user.findFirstOrThrow({
      where: {
        email: token.email,
      },
      select: {
        id: true,
      },
    });
    const { postId } = await req.json();

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

    return NextResponse.json(
      { message: "Success to update likes", likes: post?._count.likes },
      { status: 200 }
    );
  } catch (_) {
    return NextResponse.json(
      { message: "Failed to update likes" },
      { status: 500 }
    );
  }
}
