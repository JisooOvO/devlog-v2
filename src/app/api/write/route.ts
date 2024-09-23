import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NewPost } from "@/lib/store/postReducer";

interface Props {
  post: NewPost;
}

export async function POST(request: NextRequest) {
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
          email: post.authorId,
        },
      }),
      prisma.thumbnail.findFirst({
        where: {
          path: post.thumbnail as string,
        },
      }),
      prisma.topic.findFirst({
        where: {
          name: post.topic,
        },
      }),
      prisma.series.findFirst({
        where: {
          name: post.series,
        },
      }),
    ]);

    if (topic === null) {
      topic = await prisma.topic.create({
        data: {
          name: post.topic as string,
        },
      });
    }

    if (series === null) {
      series = await prisma.series.create({
        data: {
          topicId: topic.id,
          name: post.series as string,
        },
      });
    }

    const newPost = await prisma.post.create({
      data: {
        title: post.title as string,
        content: post.content as string,
        description: post.description as string,
        authorId: user?.id as string,
        thumbnailId: thumbnail?.id,
        topicId: topic.id,
        seriesId: series.id,
        published: true,
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

const checkPost = (post: NewPost) => {
  return Object.values(post).every((value) => value !== "");
};
