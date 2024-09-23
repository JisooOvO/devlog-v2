import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as File | null;

  if (image) {
    const filePath = path.join(process.cwd(), "public/thumbnails", image.name);
    const arrayBuffer = await image.arrayBuffer();
    const uin8Array = new Uint8Array(arrayBuffer);

    try {
      await fs.writeFile(filePath, uin8Array);

      await prisma.thumbnail.create({
        data: {
          name: image.name,
          path: `/thumbnails/${image.name}`,
        },
      });

      return NextResponse.json(
        {
          message: "File uploaded successfully",
          path: `/thumbnails/${image.name}`,
        },
        { status: 200 }
      );
    } catch (err) {
      return NextResponse.json(
        { message: "File save failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { message: "File is not in image format" },
    { status: 400 }
  );
}
