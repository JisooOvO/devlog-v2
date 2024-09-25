import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Content } from "@/lib/components/constant/postProps";
import { getToken } from "next-auth/jwt";

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
}

//----------------------------------------------------------

const checkPost = (post: Content) => {
  // TODO : 다시 만들기
  return true;
};
