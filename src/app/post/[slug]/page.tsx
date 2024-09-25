import { Content } from "@/lib/components/constant/postProps";
import ContentsView from "@/lib/components/contentsView";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostController from "./components/postController";

interface Params {
  slug: string;
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: {
      title: true,
    },
  });

  return posts.map((post) => ({
    slug: post.title.replace(/\s+/g, "-"),
  }));
}

const PostPage: React.FC<{ params: Params }> = async ({ params }) => {
  const content: Content = await prisma.post.findFirst({
    where: {
      title: {
        equals: decodeURIComponent(params.slug.replace(/-/g, " ")),
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likes: true,
        },
      },
      thumbnail: {
        select: {
          path: true,
        },
      },
      author: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      topic: {
        select: {
          name: true,
        },
      },
      series: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!content) {
    notFound();
  }

  return (
    <>
      <ContentsView post={content} />
      <PostController post={content} />
    </>
  );
};

export default PostPage;
