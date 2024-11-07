import updateLike from "../../../../lib/utils/functions/updateLike";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@prisma/client";
import prisma from "@/lib/utils/prisma";

export async function PUT(req: NextRequest) {
  const token = await getToken({ req });

  if (token === null) {
    return NextResponse.json({ message: "인증 실패" }, { status: 401 });
  }

  const { post }: { post: Post } = await req.clone().json();

  if (post) {
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
  }

  return updateLike(token, req);
}
