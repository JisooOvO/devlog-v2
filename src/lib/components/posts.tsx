import prisma from "../prisma";
import PostContainer from "./post";

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
            <PostContainer
              key={`post-${index}`}
              index={index}
              title={formattedTitle}
              post={post}
              thumbnail={post.thumbnail}
              author={post.author}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Posts;
