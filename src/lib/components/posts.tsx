import prisma from "../prisma";
import PostContainer from "./post";

interface Props {
  topicId?: string | undefined;
}

const Posts: React.FC<Props> = async ({ topicId }) => {
  const posts = await prisma.post.findMany({
    where: {
      topicId: topicId,
    },
    include: {
      thumbnail: true,
      author: true,
    },
  });

  return (
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
  );
};
export default Posts;
