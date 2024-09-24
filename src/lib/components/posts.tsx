import Link from "next/link";
import prisma from "../prisma";
import Image from "next/image";
import { PLACEHOLDER } from "./constant/imageProps";

interface Props {
  seriesName?: string | undefined;
  seriesId?: string | undefined;
}

const Posts: React.FC<Props> = async ({ seriesName, seriesId }) => {
  const posts = await prisma.post.findMany({
    where: {
      seriesId: seriesId,
    },
    include: {
      thumbnail: true,
      author: true,
    },
  });

  return (
    <div className="post-layout">
      {seriesName ? <p>{`# ${seriesName}`}</p> : <p># 전체보기</p>}
      <div className="post-container">
        {posts.map(async (post, index: number) => {
          const formattedTitle = post.title.replace(/\s+/g, "-").toLowerCase();

          return (
            <div key={`post-${index}`} className="post">
              <Link className="post-link" href={`/post/${formattedTitle}`}>
                <div className="post-thumbnail">
                  <Image
                    src={post.thumbnail?.path as string}
                    alt={`썸네일-${index}`}
                    fill
                    sizes="100%, 10rem"
                    placeholder="blur"
                    blurDataURL={PLACEHOLDER}
                  />
                </div>
                <div className="post-contents">
                  <p className="post-title">{post.title}</p>
                  <p className="post-description">{post.description}</p>
                </div>
                <hr />
                <div className="post-detail">
                  <p>{post.createdAt.toLocaleDateString()}</p>
                  <p>{post.likes} likes</p>
                </div>
                <div className="post-author">
                  <Image
                    src={post.author.image as string}
                    alt={`글쓴이-${index}`}
                    width={100}
                    height={100}
                  />
                  <p>by {post.author.name}</p>
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
