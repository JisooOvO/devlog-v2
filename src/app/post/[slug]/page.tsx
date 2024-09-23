import MarkdownView from "@/lib/components/contentsView";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Params {
  slug: string;
}

export const generateStaticParams = async () => {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true },
  });

  return posts.map((post) => ({
    slug: post.title.replace(/\s+/g, "-"),
  }));
};

const PostPage: React.FC<{ params: Params }> = async ({ params }) => {
  const title = params.slug.replace(/-/g, " ");

  const decodedTitle = decodeURIComponent(title);

  const post = await prisma.post.findFirst({
    where: {
      title: {
        equals: decodedTitle,
        mode: "insensitive",
      },
    },
  });

  if (!post) {
    notFound();
  }

  return <MarkdownView post={post} />;
};

export default PostPage;
