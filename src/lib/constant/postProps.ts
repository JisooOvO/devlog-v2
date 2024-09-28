import { Series } from "@prisma/client";

export type Content = {
  id?: string | undefined;
  title?: string | undefined;
  content?: string | undefined;
  description?: string | undefined;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  _count?:
    | {
        likes: number;
      }
    | null
    | undefined;
  thumbnail?:
    | {
        path: string;
      }
    | null
    | undefined;
  author?:
    | {
        name: string | null;
        email: string | null;
        image: string | null;
      }
    | null
    | undefined;
  topic?:
    | {
        id?: string | undefined;
        name: string;
      }
    | null
    | undefined;
  series?:
    | {
        id?: string | undefined;
        name: string | undefined;
      }
    | null
    | undefined;
} | null;
