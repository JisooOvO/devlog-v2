import MarkdownView from "@/lib/components/markdownView";
import prisma from "@/lib/prisma";
import { GetStaticProps } from "next";
import { notFound } from "next/navigation";

interface Params {
  slug: string;
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true },
  });

  const slug = posts.map((post) => ({
    slug: post.title.replace(/\s+/g, "-"),
  }));

  return {
    props: { slug },
    revalidate: 10,
  };
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

  console.log(decodedTitle);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <MarkdownView markdown={post.content} />
    </div>
  );
};

export default PostPage;
