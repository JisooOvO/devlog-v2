import { Content } from "@/lib/components/constant/postProps";
import ContentsView from "@/lib/components/contentsView";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Params {
  slug: string;
}

const PostPage: React.FC<{ params: Params }> = async ({ params }) => {
  const title = params.slug.replace(/-/g, " ");

  const decodedTitle = decodeURIComponent(title);

  const content: Content = await prisma.post.findFirst({
    where: {
      title: {
        equals: decodedTitle,
        mode: "insensitive",
      },
    },
    select: {
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

  console.log(content);

  if (!content) {
    notFound();
  }

  return <ContentsView post={content} />;
};

export default PostPage;
