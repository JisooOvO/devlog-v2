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
        name: string;
      }
    | null
    | undefined;
  series?:
    | {
        name: string | undefined;
      }
    | null
    | undefined;
} | null;
