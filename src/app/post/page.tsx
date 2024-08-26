import { Post } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import prisma from "@/lib/prisma";

async function getPosts(): Promise<Post[]> {
  return await prisma.post.findMany();
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}
