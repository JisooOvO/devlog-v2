import { Content } from "@/lib/constant/postProps";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import checkPost from "./func/checkPost";
import { Prisma } from "@prisma/client";

interface Props {
  post: Content;
  published: boolean;
}

export async function POST(req: NextRequest) {
  const { post, published }: Props = await req.json();

  const [missingItem, flag] = checkPost(post);

  if (published && !flag) {
    return NextResponse.json(
      { message: `${missingItem} 필수 입력 사항입니다.` },
      { status: 400 }
    );
  }

  try {
    let [user, thumbnail, topic, series] = await prisma.$transaction([
      prisma.user.findFirst({
        where: {
          email: post?.author?.email,
        },
      }),
      prisma.thumbnail.findFirst({
        where: {
          path: post?.thumbnail?.path,
        },
      }),
      prisma.topic.findFirst({
        where: {
          name: post?.topic?.name,
        },
      }),
      prisma.series.findFirst({
        where: {
          name: post?.series?.name,
        },
      }),
    ]);

    if (published) {
      if (topic === null) {
        topic = await prisma.topic.create({
          data: {
            name: post?.topic?.name as string,
          },
        });
      }

      if (series === null) {
        series = await prisma.series.create({
          data: {
            topicId: topic.id,
            name: post?.series?.name as string,
          },
        });
      }
    }

    // 새로 생성
    if (post?.id === undefined) {
      const newPost = await prisma.post.create({
        data: {
          title: post?.title as string,
          content: post?.content as string,
          description: post?.description as string,
          authorId: user?.id as string,
          thumbnailId: thumbnail?.id,
          topicId: topic?.id,
          seriesId: series?.id,
          published: published,
        },
      });

      return NextResponse.json(
        { message: "글 쓰기에 성공하였습니다.", title: newPost.title },
        { status: 200 }
      );
    } else {
      const updatedPost = await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          title: post.title,
          description: post.description,
          thumbnailId: thumbnail?.id ? thumbnail.id : null,
          topicId: topic?.id,
          seriesId: series?.id,
          content: post.content,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json(
        { message: "글 수정에 성공하였습니다.", title: updatedPost.title },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            { message: "이미 사용 중인 제목입니다.", error },
            { status: 500 }
          );
      }
    }
    return NextResponse.json(
      { message: "글 쓰기에 실패하였습니다.", error },
      { status: 500 }
    );
  }
}

//----------------------------------------------------------

export async function PUT(req: NextRequest) {
  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json({ message: "인증 실패" }, { status: 401 });
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

    return NextResponse.json({ likes: post?._count.likes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

//----------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json({ message: "인증 실패" }, { status: 401 });
  }

  const { post }: { post: Content } = await req.json();

  // TODO : 권한으로 판단
  if (post?.author?.email !== token.email) {
    return NextResponse.json(
      { message: "유저 정보가 일치하지 않습니다." },
      { status: 401 }
    );
  }

  try {
    await prisma.post.delete({
      where: {
        id: post?.id,
      },
    });

    return NextResponse.json(
      { message: "성공적으로 글 삭제하였습니다." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "글 삭제에 실패하였습니다." },
      { status: 500 }
    );
  }
}
