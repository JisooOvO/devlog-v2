import { Content } from "@/lib/constant/postProps";
import ContentsView from "@/lib/components/contentsView";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostController from "./components/postController";
import Posts from "@/lib/components/posts";
import Link from "next/link";
import IconButton from "@/lib/components/iconButton";
import RightArrowIcon from "@/lib/icons/rightArrow";
import LeftArrowIcon from "@/lib/icons/leftArrow";

export const revalidate = 10;
export const dynamicParams = true;

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
          id: true,
          name: true,
        },
      },
      series: {
        select: {
          id: true,
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
      <LinkToOtherPost currentPost={content} />
      <div className="post-another-series">
        <Posts
          seriesName={content.series?.name}
          seriesId={content.series?.id}
          postId={content.id}
          showSeries={false}
          take={3}
        />
        <Posts
          topicId={content.topic?.id}
          seriesId={content.series?.id}
          postId={content.id}
          showSeries={false}
          take={3}
        />
      </div>
      <PostController post={content} />
    </>
  );
};

// --------------------------------------------------------------------------

const size = "2rem";

interface Props {
  currentPost: Content;
}

const LinkToOtherPost: React.FC<Props> = async ({ currentPost }) => {
  const previousPost = await prisma.post.findFirst({
    where: {
      seriesId: currentPost?.series?.id,
      published: true,
      id: {
        not: currentPost?.id,
        lt: currentPost?.id,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  const nextPost = await prisma.post.findFirst({
    where: {
      seriesId: currentPost?.series?.id,
      published: true,
      id: {
        not: currentPost?.id,
        gt: currentPost?.id,
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <>
      <div className="post-other-link-container">
        {previousPost ? (
          <Link href={`/post/${previousPost.title}`}>
            <IconButton description="">
              <LeftArrowIcon width={size} height={size} />
            </IconButton>
            {previousPost.title}
          </Link>
        ) : (
          <div></div>
        )}
        {nextPost ? (
          <Link href={`/post/${nextPost.title}`}>
            {nextPost.title}
            <IconButton description="">
              <RightArrowIcon width={size} height={size} />
            </IconButton>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        <hr />
      </div>
    </>
  );
};

export default PostPage;
