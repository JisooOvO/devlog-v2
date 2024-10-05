import Link from "next/link";
import prisma from "../prisma";
import Image from "next/image";
import "@/style/post.css";
import getDateKoreanString from "@/lib/func/getDateKoreanString";
import LikeContainer from "@/lib/components/likeContainer";
import { Content } from "@/lib/constant/postProps";
import { PLACEHOLDER } from "@/lib/constant/imageProps";
import PostPageButton from "./postPageButton";

interface Props {
  topicId?: string | undefined;
  seriesName?: string | undefined;
  seriesId?: string | undefined;
  postId?: string | undefined;
  showSeries: boolean;
  take?: number;
  page?: number;
  orderRule?: "asc" | "desc";
}

const size = "1rem";

const Posts: React.FC<Props> = async ({
  topicId,
  seriesName,
  seriesId,
  postId,
  showSeries,
  take,
  page,
  orderRule,
}) => {
  const posts: Array<Content> = await prisma.post.findMany({
    where: {
      ...(topicId !== undefined && { topicId: topicId }),
      published: true,
      ...(postId !== undefined && { id: { not: postId } }),
      ...(seriesId !== undefined && {
        OR: [
          {
            seriesId: topicId ? { not: seriesId } : seriesId,
          },
        ],
      }),
    },
    orderBy: {
      createdAt: orderRule ? orderRule : "desc",
    },
    skip: (take ?? 9) * ((page ?? 1) - 1),
    take: (take ?? 9) * (page ?? 1),
    include: {
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
          image: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const maximum = await prisma.post.count({
    where: {
      published: true,
      ...(seriesId && { seriesId: seriesId }),
    },
  });

  return posts.length !== 0 ? (
    <div className="post-layout">
      <PostTitle
        showSeries={showSeries}
        seriesName={seriesName}
        topicId={topicId}
        take={take}
        maximum={maximum}
      />
      <PostContainer posts={posts} />
      {page ? (
        <PostPageButton page={page} take={take ?? 9} maximum={maximum} />
      ) : null}
    </div>
  ) : (
    <></>
  );
};

// --------------------------------------------------------------------------

const PostTitle: React.FC<Props & { maximum: number }> = ({
  showSeries,
  seriesName,
  topicId,
  take,
  maximum,
}) => {
  return (
    <>
      {showSeries ? (
        seriesName ? (
          <div className="post-series-title-container">
            <p className="post-series-title">{`# ${seriesName}`}</p>
            {take && maximum > take ? (
              <Link className="post-watch-more" href={`/series/${seriesName}`}>
                전체보기
              </Link>
            ) : null}
          </div>
        ) : (
          <p className="post-series-title"># 전체 포스트</p>
        )
      ) : topicId ? (
        <p className="post-series-title">관련 포스트</p>
      ) : (
        <p className="post-series-title">{seriesName} 시리즈의 다른 포스트</p>
      )}
    </>
  );
};

// --------------------------------------------------------------------------

interface PostContainerProps {
  posts: Array<Content>;
}

const PostContainer: React.FC<PostContainerProps> = ({ posts }) => {
  return (
    <div className="post-container">
      {posts.map(async (post, index: number) => {
        const formattedTitle = post?.title?.replace(/\s+/g, "-").toLowerCase();

        return (
          <div key={`post-${index}`} className="post">
            <Link className="post-link" href={`/post/${formattedTitle}`}>
              <div className="post-thumbnail">
                <Image
                  src={
                    typeof post?.thumbnail?.path === "string"
                      ? post?.thumbnail?.path
                      : PLACEHOLDER
                  }
                  alt={`썸네일-${index}`}
                  fill
                  sizes="100%, 10rem"
                  placeholder="blur"
                  blurDataURL={PLACEHOLDER}
                />
              </div>
              <div className="post-contents">
                <p className="post-title">{post?.title}</p>
                <p className="post-description">{post?.description}</p>
              </div>
              <hr />
              <div className="post-detail">
                <p>{getDateKoreanString(post?.createdAt)}</p>
                <LikeContainer size={size} post={post} />
              </div>
              <div className="post-author">
                <div className="post-author-img">
                  <Image
                    src={post?.author?.image as string}
                    alt={`글쓴이-${index}`}
                    fill
                    sizes="100% 100%"
                  />
                </div>
                <p>by {post?.author?.name}</p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
