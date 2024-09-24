"use client";

import { Content } from "@/lib/components/constant/postProps";
import IconButton from "@/lib/components/iconButton";
import StarIcon from "@/lib/icons/star";
import "@/style/content.css";

interface Props {
  size: string;
  post: Content;
}

const LikeContainer: React.FC<Props> = ({ size, post }) => {
  return (
    <div className="content-likes">
      <IconButton description="좋아요" onClick={() => {}}>
        <StarIcon width={size} height={size} />
      </IconButton>
      <p>{post?.likes ? post.likes : 0}</p>
    </div>
  );
};

export default LikeContainer;
