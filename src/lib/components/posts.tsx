import Link from "next/link";
import prisma from "../utils/prisma";
import getDateKoreanString from "@/lib/utils/functions/getDateKoreanString";
import LikeContainer from "@/lib/components/likeContainer";
import Content from "@/lib/types/content";
import PostPageButton from "./pages/post/postPageButton";
import ImageContainer from "./imageContainer";
import { defaultTake } from "../constants/constants";
import "@/style/post.css";

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
      ...(topicId && { topicId: topicId }),
      published: true,
      ...(postId && { id: { not: postId } }),
      ...(seriesId && {
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
    skip: (take ?? defaultTake) * ((page ?? 1) - 1),
    take: (take ?? defaultTake) * (page ?? 1),
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
      <PostSectionTitle
        showSeries={showSeries}
        seriesName={seriesName}
        topicId={topicId}
        take={take}
        maximum={maximum}
      />
      <PostContainer posts={posts} />
      {page ? (
        <PostPageButton
          page={page}
          take={take ?? defaultTake}
          maximum={maximum}
        />
      ) : null}
    </div>
  ) : (
    <></>
  );
};

// --------------------------------------------------------------------------

const PostSectionTitle: React.FC<Props & { maximum: number }> = ({
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
                <ImageContainer
                  width="100%"
                  height="10rem"
                  src={post?.thumbnail?.path}
                  alt={`썸네일-${index}`}
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
                <ImageContainer
                  width="1.5rem"
                  height="1.5rem"
                  src={post?.author?.image as string}
                  alt={`글쓴이-${index}`}
                />
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
