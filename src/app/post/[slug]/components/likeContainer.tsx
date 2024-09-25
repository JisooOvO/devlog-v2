"use client";

import { Content } from "@/lib/components/constant/postProps";
import IconButton from "@/lib/components/iconButton";
import StarIcon from "@/lib/icons/star";
import "@/style/content.css";
import { useState } from "react";

interface Props {
  size: string;
  post: Content;
}

const LikeContainer: React.FC<Props> = ({ size, post }) => {
  const [like, setLike] = useState<number | undefined>(post?._count?.likes);

  return (
    <div className="content-likes">
      <IconButton
        description="좋아요"
        onClick={(e) => {
          e.preventDefault();

          const fetchData = async () => {
            const response = await fetch("/api/post", {
              method: "put",
              body: JSON.stringify({ postId: post?.id }),
            });

            switch (response.status) {
              case 200:
                const jsonData = await response.json();
                setLike(jsonData["likes"]);
            }
          };

          fetchData();
        }}
      >
        <StarIcon width={size} height={size} />
      </IconButton>
      <p>{like ? like : 0}</p>
    </div>
  );
};

export default LikeContainer;
