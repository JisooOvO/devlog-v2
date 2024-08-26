import prisma from "@/lib/prisma";
import { Blog } from "@prisma/client";

async function getBlog(): Promise<Blog | null> {
  return await prisma.blog.findFirst();
}

export default async function BlogHeader() {
  const blog = await getBlog();
  return (
    <header>
      <p>{blog?.title ?? "My First Blog"}</p>
      {blog?.categories ? <ul></ul> : "No Category"}
    </header>
  );
}
