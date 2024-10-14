import { Comment } from "@/lib/components/pages/post/commentContainer";
import checkAuth from "@/lib/utils/functions/checkAuth";
import prisma from "@/lib/utils/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const referer = req.headers.get("referer");

  if (referer) {
    const urlPostTitle = referer.split("/").pop();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");

    if (urlPostTitle) {
      const post = await prisma.post.findFirst({
        where: {
          title: {
            equals: decodeURIComponent(urlPostTitle.replaceAll("-", " ")),
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      });

      if (!post) {
        return NextResponse.json(
          { message: "댓글 요청에 실패하였습니다." },
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
        skip: 10 * (page - 1),
        take: 10 * page,
      });

      const maximum = await prisma.comment.count();

      return NextResponse.json({ comments, maximum }, { status: 200 });
    }
  }

  return NextResponse.json(
    { message: "댓글 요청에 실패하였습니다." },
    { status: 500 }
  );
}

// --------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const { comment, postId } = await req.json();

  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json(
      { message: "로그인 후 이용 가능합니다." },
      { status: 401 }
    );
  }

  if (!comment) {
    return NextResponse.json(
      { message: "내용을 입력하세요." },
      { status: 400 }
    );
  }

  if (!postId) {
    return NextResponse.json(
      { message: "일치하는 포스트가 없습니다." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: token.email,
        name: token.name,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "일치하는 유저가 없습니다." },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        content: comment,
        userId: user.id,
        postId: postId,
      },
      select: {
        id: true,
        content: true,
        user: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "댓글 등록에 성공했습니다.", newComment },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "댓글 등록에 실패했습니다.", err },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------

export async function PUT(req: NextRequest) {
  const { comment }: { comment: Comment } = await req.json();

  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json(
      { message: "로그인 후 이용 가능합니다." },
      { status: 401 }
    );
  }

  if (token.email !== comment.user.email) {
    return NextResponse.json(
      { message: "작성자 본인만 수정할 수 있습니다." },
      { status: 400 }
    );
  }

  try {
    await prisma.comment.update({
      where: {
        id: comment.id,
      },
      data: {
        content: comment.content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "댓글 수정에 성공했습니다." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "댓글 수정에 실패했습니다.", err },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const { comment }: { comment: Comment } = await req.json();

  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json(
      { message: "로그인 후 이용 가능합니다." },
      { status: 401 }
    );
  }

  if (!(await checkAuth(token.email))) {
    if (token.email !== comment.user.email) {
      return NextResponse.json(
        { message: "작성자 본인만 삭제할 수 있습니다." },
        { status: 400 }
      );
    }
  }

  try {
    await prisma.comment.delete({
      where: {
        id: comment.id,
      },
    });

    return NextResponse.json(
      { message: "댓글 삭제에 성공했습니다." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "댓글 삭제에 실패했습니다.", err },
      { status: 500 }
    );
  }
}
