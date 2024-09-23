import { Post, Thumbnail, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface Props {
  index: number;
  title: string;
  post: Post;
  thumbnail: Thumbnail | null;
  author: User;
}

const PostContainer: React.FC<Props> = ({
  index,
  title,
  post,
  thumbnail,
  author,
}) => {
  return (
    <div className="post">
      <Link className="post-link" href={`/post/${title}`}>
        <div className="post-thumbnail">
          <Image
            src={thumbnail?.path as string}
            alt={`썸네일-${index}`}
            fill
            sizes="100%, 10rem"
            placeholder="blur"
            blurDataURL="/placeholder/placeholder.jpg"
          />
        </div>
        <div className="post-contents">
          <p className="post-title">{post.title}</p>
          <p className="post-description">{post.description}</p>
        </div>
        <hr />
        <div className="post-detail">
          <p>{post.createdAt.toLocaleDateString()}</p>
          <p>{post.likes} likes</p>
        </div>
        <div className="post-author">
          <Image
            src={author.image as string}
            alt={`글쓴이-${index}`}
            width={100}
            height={100}
          />
          <p>by {author.name}</p>
        </div>
      </Link>
    </div>
  );
};

export default PostContainer;
