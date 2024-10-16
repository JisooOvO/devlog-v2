"use client";

import { Content } from "@/lib/utils/constants/postProps";
import IconButton from "@/lib/components/iconButton";
import DeleteIcon from "@/lib/icons/delete";
import EditIcon from "@/lib/icons/edit";
import UpArrowIcon from "@/lib/icons/upArrow";
import { PostAction, PostActionType } from "@/lib/utils/reducers/postReducer";
import "@/style/post.css";
import { Dispatch } from "@reduxjs/toolkit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const size = "2rem";

interface Props {
  post: Content;
}

const PostController: React.FC<Props> = ({ post }) => {
  const { data } = useSession();
  const router = useRouter();
  const dispatch: Dispatch<PostAction> = useDispatch();

  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/auth/user", {
        method: "POST",
        body: JSON.stringify({ email: data?.user?.email }),
      });

      const jsonData = await response.json();

      switch (response.status) {
        case 200:
          setRole(jsonData["role"]);
          break;
      }
    };

    if (data?.user?.email) {
      fetchData();
    }
  }, [data?.user?.email]);

  return (
    <div className="post-controller">
      <IconButton
        description="맨 위로"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <UpArrowIcon width={size} height={size} />
      </IconButton>

      {role === "owner" ? (
        <>
          <IconButton
            description="수정하기"
            onClick={() => {
              dispatch({
                type: PostActionType.SET_POST,
                payload: {
                  id: post?.id,
                  title: post?.title,
                  description: post?.description,
                  thumbnail: post?.thumbnail,
                  content: post?.content,
                  topic: post?.topic,
                  series: post?.series,
                  published: post?.published,
                  author: post?.author,
                  _count: post?._count,
                },
              });
              router.push("/write");
            }}
          >
            <EditIcon width={size} height={size} />
          </IconButton>
          <IconButton
            description="삭제하기"
            onClick={() => {
              const flag = confirm("정말로 삭제하시겠습니까?");

              if (!flag) return;

              const fetchData = async () => {
                const response = await fetch("/api/post", {
                  method: "delete",
                  body: JSON.stringify({ post }),
                });

                switch (response.status) {
                  case 200:
                    alert("삭제되었습니다");
                    window.location.href = "/";
                    break;
                  default:
                    alert("삭제 안됨");
                    break;
                }
              };

              fetchData();
            }}
          >
            <DeleteIcon width={size} height={size} />
          </IconButton>
        </>
      ) : null}
    </div>
  );
};

export default PostController;
