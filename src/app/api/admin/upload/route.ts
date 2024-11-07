import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import prisma from "@/lib/utils/prisma";
import customResponse from "@/lib/constants/customResponse";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as File | null;
  const directory = formData.get("directory")?.toString();

  if (image) {
    const filePath = path.join(
      process.cwd(),
      `public/${directory}`,
      image.name
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

      return customResponse(
        {
          success: true,
          data: `/${directory}/${image.name}`,
        },
        { status: 200 }
      );
    } catch (err) {
      return customResponse(
        { success: false, message: "파일 저장에 실패하였습니다." },
        { status: 500 }
      );
    }
  }

  return customResponse(
    { success: false, message: "파일이 형식에 맞지 않거나 파일이 없습니다." },
    { status: 400 }
  );
}
