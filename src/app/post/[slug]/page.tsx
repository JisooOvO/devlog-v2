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
import CommentContainer from "./components/commentContainer";
import { Metadata, ResolvingMetadata } from "next";
import getPostByTitle from "./func/getPostByTitle";
import { metadata } from "@/app/layout";

export const revalidate = 10;
export const dynamicParams = true;

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

interface Params {
  slug: string;
}

type MetaProps = {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: MetaProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;

  const post = await getPostByTitle(
    decodeURIComponent(params.slug.replace(/-/g, " "))
  );

  const previousImages = (await parent).openGraph?.images || [];

  return {
    ...metadata,
    title: post?.title,
    openGraph: {
      title: post?.title,
      description: post?.description,
      images: [post?.thumbnail?.path ?? "", ...previousImages],
      url: `/post/${post?.title}`,
    },
  };
}

const PostPage: React.FC<{ params: Params }> = async ({ params }) => {
  const content: Content = await getPostByTitle(
    decodeURIComponent(params.slug.replace(/-/g, " "))
  );

  if (!content) {
    notFound();
  }

  return (
    <>
      <ContentsView post={content} />
      <LinkToOtherPost currentPost={content} />
      <CommentContainer postId={content.id} />
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
