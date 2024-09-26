import Link from "next/link";
import prisma from "../prisma";
import Image from "next/image";
import "@/style/post.css";
import getDateKoreanString from "@/lib/func/getDateKoreanString";
import LikeContainer from "@/lib/components/likeContainer";
import { Content } from "@/lib/constant/postProps";
import { PLACEHOLDER } from "@/lib/constant/imageProps";

interface Props {
  topicId?: string | undefined;
  seriesName?: string | undefined;
  seriesId?: string | undefined;
  postId?: string | undefined;
  showSeries: boolean;
}

const size = "1rem";

const Posts: React.FC<Props> = async ({
  topicId,
  seriesName,
  seriesId,
  postId,
  showSeries,
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
      createdAt: "desc",
    },
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

  return posts.length !== 0 ? (
    <div className="post-layout">
      {showSeries ? (
        seriesName ? (
          <p>{`# ${seriesName}`}</p>
        ) : (
          <p># 전체 포스트</p>
        )
      ) : topicId ? (
        <p>관련 포스트</p>
      ) : (
        <p>{seriesName} 시리즈의 다른 포스트</p>
      )}
      <div className="post-container">
        {posts.map(async (post, index: number) => {
          const formattedTitle = post?.title
            ?.replace(/\s+/g, "-")
            .toLowerCase();

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
                  <Image
                    src={post?.author?.image as string}
                    alt={`글쓴이-${index}`}
                    width={100}
                    height={100}
                  />
                  <p>by {post?.author?.name}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};
export default Posts;
