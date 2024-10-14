"use client";

import { Content } from "@/lib/constants/postProps";
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

            const jsonData = await response.json();

            switch (response.status) {
              case 200:
                setLike(jsonData["likes"]);
                break;
              default:
                alert("로그인 후 이용 가능합니다.");
            }
          };

          fetchData();
        }}
      >
        <StarIcon width={size} height={size} fill={"#ffa500"} />
      </IconButton>
      <p>{like ? like : 0}</p>
    </div>
  );
};

export default LikeContainer;
