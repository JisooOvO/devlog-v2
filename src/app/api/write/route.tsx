import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { title, content } = await request.json();

  if (!title || !content) {
    return NextResponse.json(
      { message: "Title and content are required." },
      { status: 400 }
    );
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
      },
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating post." },
      { status: 500 }
    );
  }
}
