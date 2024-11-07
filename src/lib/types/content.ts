import { Post, Thumbnail, User } from "@prisma/client";

type Content =
  | (Partial<Post> & {
      _count?: {
        likes: number;
      } | null;
      thumbnail?: Pick<Thumbnail, "path"> | null;
      author?: Pick<User, "name" | "email" | "image"> | null;
      topic?: {
        id?: string;
        name: string;
      } | null;
      series?: {
        id?: string;
        name: string;
      } | null;
    })
  | null;

export default Content;
