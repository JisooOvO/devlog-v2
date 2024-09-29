import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as File | null;
  const directory = formData.get("directory")?.toString();

  if (image) {
    const filePath = path.join(
      process.cwd(),
      `public/${directory}`,
      image.name,
    );
    const arrayBuffer = await image.arrayBuffer();
    const uin8Array = new Uint8Array(arrayBuffer);

    try {
      await fs.writeFile(filePath, uin8Array);

      switch (directory) {
        case "thumbnails":
          await prisma.thumbnail.create({
            data: {
              name: image.name,
              path: `/${directory}/${image.name}`,
            },
          });
          break;
      }

      return NextResponse.json(
        {
          path: `/${directory}/${image.name}`,
        },
        { status: 200 },
      );
    } catch (err) {
      return NextResponse.json(
        { message: "파일 저장에 실패하였습니다.", err },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { message: "파일이 형식에 맞지 않거나 없습니다." },
    { status: 400 },
  );
}
