import PostContainer from "@/lib/components/post";
import prisma from "@/lib/prisma";
import { Post, Thumbnail, User } from "@prisma/client";
import Link from "next/link";

export const revalidate = 10;
export const dynamicParams = true;

const getPosts = async () => {
  return await prisma.post.findMany({
    include: {
      thumbnail: true,
      author: true,
    },
  });
};

const HomePage: React.FC = async () => {
  const posts = await getPosts();

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
      {/* <div style={{ height: "200vh" }}></div> */}
    </div>
  );
};

export default HomePage;
