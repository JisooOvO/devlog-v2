"use client";

import Content from "@/lib/types/content";
import IconButton from "@/lib/components/iconButton";
import DeleteIcon from "@/lib/icons/delete";
import EditIcon from "@/lib/icons/edit";
import UpArrowIcon from "@/lib/icons/upArrow";
import { PostAction, PostActionType } from "@/lib/utils/reducers/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import useFetchData from "@/lib/hooks/useFetchData";
import "@/style/post.css";

const size = "2rem";

interface Props {
  post: Content;
}

const PostController: React.FC<Props> = ({ post }) => {
  const dispatch: Dispatch<PostAction> = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();

  const { data: role, fetchData } = useFetchData(
    "/api/auth/users",
    "guest",
    false
  );

  useEffect(() => {
    if (session?.user?.email) {
      fetchData({
        method: "POST",
        body: JSON.stringify({ email: session?.user?.email }),
      });
    }
  }, [session?.user?.email, fetchData]);

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
                payload: post,
              });
              router.push("/admin/write");
            }}
          >
            <EditIcon width={size} height={size} />
          </IconButton>
          <DeleteButton post={post} />
        </>
      ) : null}
    </div>
  );
};

//----------------------------------------------------------

const DeleteButton: React.FC<Props> = ({ post }) => {
  const {
    data: success,
    isLoading,
    fetchData,
  } = useFetchData("/api/admin/posts", false, false);

  useEffect(() => {
    if (success) {
      window.location.href = "/";
    }
  }, [success]);

  return (
    <IconButton
      description="삭제하기"
      onClick={() => {
        const flag = confirm("정말로 삭제하시겠습니까?");

        if (!flag) return;

        if (!isLoading) {
          fetchData({
            method: "delete",
            body: JSON.stringify({ posts: post }),
          });
        }
      }}
    >
      <DeleteIcon width={size} height={size} />
    </IconButton>
  );
};

export default PostController;
