import { Comment } from "@/lib/components/pages/post/commentContainer";
import checkAuth from "@/lib/utils/functions/checkAuth";
import customResponse from "@/lib/constants/customResponse";
import prisma from "@/lib/utils/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { comment, postId, email } = await req.json();

  if (!comment) {
    return customResponse(
      { success: false, message: "내용을 입력하세요." },
      { status: 400 }
    );
  }

  if (!postId) {
    return customResponse(
      { success: false, message: "일치하는 포스트가 없습니다." },
      { status: 204 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return customResponse(
        { success: false, message: "일치하는 유저가 없습니다." },
        { status: 204 }
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

    return customResponse(
      {
        success: true,
        data: newComment,
      },
      { status: 200 }
    );
  } catch {
    return customResponse(
      { success: false, message: "댓글 등록에 실패했습니다." },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------

export async function DELETE(req: NextRequest) {
  const { comment, email }: { comment: Comment; email: string } =
    await req.json();

  if (!(await checkAuth(email))) {
    if (email !== comment.user.email) {
      return customResponse(
        { success: false, message: "작성자 본인만 삭제할 수 있습니다." },
        { status: 400 }
      );
    }
  }

  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: comment.id,
      },
    });

    return customResponse(
      {
        success: true,
        message: "댓글 삭제에 성공했습니다.",
        data: deletedComment,
      },
      { status: 200 }
    );
  } catch {
    return customResponse(
      { success: true, message: "댓글 삭제에 실패했습니다.", data: null },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------

export async function PUT(req: NextRequest) {
  const { comment, email }: { comment: Comment; email: string } =
    await req.json();

  if (!(await checkAuth(email))) {
    if (email !== comment.user.email) {
      return customResponse(
        { success: false, message: "작성자 본인만 삭제할 수 있습니다." },
        { status: 400 }
      );
    }
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: comment.id,
      },
      data: {
        content: comment.content,
        updatedAt: new Date(),
      },
    });

    return customResponse(
      {
        success: true,
        message: "댓글 수정에 성공했습니다.",
        data: updatedComment,
      },
      { status: 200 }
    );
  } catch {
    return customResponse(
      { success: true, message: "댓글 수정에 실패했습니다.", data: null },
      { status: 500 }
    );
  }
}
