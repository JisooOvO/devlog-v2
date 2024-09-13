import prisma from "@/lib/prisma";
import { Post } from "@prisma/client";
import Link from "next/link";

export const revalidate = 10;
export const dynamicParams = true;

const getPosts = async () => {
  return await prisma.post.findMany();
};

const HomePage: React.FC = async () => {
  const posts = await getPosts();

  return (
    <div className="post-container">
      {posts.map((post: Post, index: number) => {
        const formattedTitle = post.title.replace(/\s+/g, "-").toLowerCase();

        return (
          <div key={`post-${index}`} className="post">
            <Link className="post-link" href={`/post/${formattedTitle}`}>
              <p>{post.title}</p>
            </Link>
          </div>
        );
      })}
      {/* <div style={{ height: "200vh" }}></div> */}
    </div>
  );
};

export default HomePage;
