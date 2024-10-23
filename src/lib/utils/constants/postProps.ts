// export type Content = {
//   id?: string;
//   title?: string;
//   content?: string;
//   description?: string;
//   published?: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
//   _count?: {
//     likes: number;
//   } | null;
//   thumbnail?: {
//     path: string;
//   } | null;
//   author?: {
//     name: string | null;
//     email: string | null;
//     image: string | null;
//   } | null;
//   topic?: {
//     id?: string;
//     name: string;
//   } | null;
//   series?: {
//     id?: string;
//     name?: string;
//   } | null;
// } | null;

import { Post, Thumbnail, User } from "@prisma/client";

export type Content =
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
