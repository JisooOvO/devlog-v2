import Content from "@/lib/types/content";
import checkPost from "@/lib/utils/functions/checkPost";
import customResponse from "@/lib/constants/customResponse";
import prisma from "@/lib/utils/prisma";
import { Post, Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

interface Props {
  post: Content;
  published: boolean;
}

export async function POST(req: NextRequest) {
  const { post, published }: Props = await req.json();

  const [missingItem, flag] = checkPost(post);

  if (published && !flag) {
    return customResponse(
      { success: false, message: `${missingItem} 필수 입력 사항입니다.` },
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
          topic: {
            name: post?.topic?.name,
          },
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

      return customResponse(
        {
          success: true,
          message: "성공적으로 글이 저장되었습니다.",
          data: newPost.title,
        },
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

      return customResponse(
        {
          success: true,
          message: "글 수정에 성공하였습니다.",
          data: updatedPost.title,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return customResponse(
            {
              success: false,
              message: `이미 사용 중인 ${error.meta?.modelName}입니다.`,
            },
            { status: 400 }
          );
      }
    }

    return customResponse(
      { success: true, message: "게시글 쓰기에 실패하였습니다." },
      { status: 500 }
    );
  }
}

//----------------------------------------------------------

export async function PUT(req: NextRequest) {
  const { posts }: { posts: Post } = await req.clone().json();

  if (posts) {
    try {
      const updatedPost = await prisma.post.update({
        where: {
          id: posts.id,
        },
        data: {
          ...posts,
          published: posts.published.toString() === "false" ? false : true,
          updatedAt: new Date(),
        },
      });

      return customResponse(
        {
          success: true,
          message: "글 수정에 성공하였습니다.",
          data: updatedPost.title,
        },
        { status: 200 }
      );
    } catch (e) {
      console.log(e);
      return customResponse(
        { success: false, message: "글 수정에 실패하였습니다." },
        { status: 500 }
      );
    }
  }

  return customResponse(
    { success: false, message: "글 수정에 실패하였습니다." },
    { status: 404 }
  );
}

//----------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const { posts }: { posts: Content } = await req.json();

  try {
    await prisma.post.delete({
      where: {
        id: posts?.id,
      },
    });

    return customResponse(
      {
        success: true,
        message: "성공적으로 게시글을 삭제하였습니다.",
        data: true,
      },
      { status: 200 }
    );
  } catch {
    return customResponse(
      {
        success: true,
        message: "게시글 삭제 도중 오류가 발생했습니다.",
        data: false,
      },
      { status: 500 }
    );
  }
}
