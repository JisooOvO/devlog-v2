import prisma from "@/lib/prisma";
import { Post } from "@prisma/client";
import { NextResponse } from "next/server";

const updatePost = async (post: Post) => {
  try {
    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        ...post,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "성공적으로 수정되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "수정에 실패하였습니다.", error },
      { status: 500 }
    );
  }
};

export default updatePost;
