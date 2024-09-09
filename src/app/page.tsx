import prisma from "@/lib/prisma";
import Link from "next/link";

interface PostIDAndTitle {
  title: string;
  content: string;
}

const getPosts = async () => {
  return await prisma.post.findMany({
    select: { title: true, content: true },
  });
};

const HomePage: React.FC = async () => {
  const posts = await getPosts();

  return (
    <div className="post-container">
      {posts.map((post: PostIDAndTitle, index: number) => {
        const formattedTitle = post.title.replace(/\s+/g, "-").toLowerCase();

        return (
          <div key={`post-${index}`} className="post">
            <Link className="post-link" href={`/post/${formattedTitle}`}>
              <p>{post.title}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
