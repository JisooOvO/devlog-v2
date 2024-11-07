"use client";

import Content from "@/lib/types/content";
import IconButton from "@/lib/components/iconButton";
import StarIcon from "@/lib/icons/star";
import Spinner from "../icons/spinner";
import useFetchData from "../hooks/useFetchData";
import { useSession } from "next-auth/react";
import { apiRequestForLikeWhenPost } from "../types/apiRequest";
import "@/style/content.css";

interface Props {
  size: string;
  post: Content;
}

const LikeContainer: React.FC<Props> = ({ size, post }) => {
  const { data: session } = useSession();
  const { data, isLoading, fetchData } = useFetchData(
    `/api/user/posts/${post?.id}/likes`,
    post?._count?.likes,
    false
  );

  return (
    <div className="content-likes">
      <IconButton
        description="좋아요"
        onClick={(e) => {
          e.preventDefault();

          const request: apiRequestForLikeWhenPost = {
            email: session?.user?.email,
          };

          if (!session?.user?.email) {
            alert("로그인 후 이용 가능합니다.");
            return;
          }

          if (!isLoading) {
            fetchData({
              method: "post",
              body: JSON.stringify(request),
            });
          }
        }}
      >
        <StarIcon width={size} height={size} fill={"#ffa500"} />
      </IconButton>
      <div className="content-spinner">
        {isLoading ? <Spinner /> : <p>{data}</p>}
      </div>
    </div>
  );
};

export default LikeContainer;
