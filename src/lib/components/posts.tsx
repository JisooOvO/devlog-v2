import Link from "next/link";
import prisma from "../prisma";
import Image from "next/image";
import { PLACEHOLDER } from "./constant/imageProps";
import "@/style/post.css";
import getDateKoreanString from "./func/getDateKoreanString";
import LikeContainer from "@/app/post/[slug]/components/likeContainer";
import { Content } from "./constant/postProps";

interface Props {
  seriesName?: string | undefined;
  seriesId?: string | undefined;
}

const size = "1rem";

const Posts: React.FC<Props> = async ({ seriesName, seriesId }) => {
  // TODO : CSRF 토큰, Authorization 토큰
  const posts: Array<Content> = await prisma.post.findMany({
    where: {
      seriesId: seriesId,
      published: true,
    },
    orderBy: {
      createdAt: "asc",
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

  return (
    <div className="post-layout">
      {seriesName ? <p>{`# ${seriesName}`}</p> : <p># 전체보기</p>}
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
  );
};
export default Posts;
