import { Content } from "@/lib/components/constant/postProps";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import checkPost from "./func/checkPost";

interface Props {
  post: Content;
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (token === null) {
    return NextResponse.json(
      { message: "authorization failed" },
      { status: 401 }
    );
  }

  const { post }: Props = await request.json();

  if (!checkPost(post)) {
    return NextResponse.json(
      { message: "Something is missing" },
      { status: 400 }
    );
  }

  if (post?.id === undefined) {
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

      const newPost = await prisma.post.create({
        data: {
          title: post?.title as string,
          content: post?.content as string,
          description: post?.description as string,
          authorId: user?.id as string,
          thumbnailId: thumbnail?.id,
          topicId: topic.id,
          seriesId: series.id,
          published: post?.published,
        },
      });

      return NextResponse.json(
        { message: "Save completed", title: newPost.title },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Save failed", error },
        { status: 500 }
      );
    }
  } else {
    try {
      let [thumbnail, topic, series] = await prisma.$transaction([
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

      const updatedPost = await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          title: post.title,
          description: post.description,
          thumbnailId: thumbnail?.id,
          topicId: topic.id,
          seriesId: series.id,
          content: post.content,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json(
        { message: "Save completed", title: updatedPost.title },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Save failed", error },
        { status: 500 }
      );
    }
  }
}

//----------------------------------------------------------

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
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update likes" },
      { status: 500 }
    );
  }
}

//----------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json(
      { message: "authorization failed" },
      { status: 401 }
    );
  }

  const { post }: { post: Content } = await req.json();

  if (post?.author?.email !== token.email) {
    return NextResponse.json({ message: "User mismatch" }, { status: 401 });
  }

  try {
    await prisma.post.delete({
      where: {
        id: post?.id,
      },
    });

    return NextResponse.json(
      { message: "Success delete post" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed delete post" },
      { status: 500 }
    );
  }
}
