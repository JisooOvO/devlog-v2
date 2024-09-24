export type Content = {
  title?: string | undefined;
  content?: string | undefined;
  description?: string | undefined;
  likes?: number;
  createdAt?: Date;
  updatedAt?: Date;
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
        name: string;
      }
    | null
    | undefined;
} | null;
