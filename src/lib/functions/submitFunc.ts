import { Content } from "@/lib/constants/postProps";
import { PostAction, PostActionType } from "@/lib/utils/reducers/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch as SetState, SetStateAction } from "react";

interface SubmitProps {
  event: React.FormEvent;
  isClick: boolean;
  setIsClick: SetState<SetStateAction<boolean>>;
  router: AppRouterInstance;
  newPost: Content;
  dispatch: Dispatch<PostAction>;
}

const handleSubmit = async ({
  event,
  isClick,
  setIsClick,
  router,
  newPost,
  dispatch,
}: SubmitProps) => {
  event.preventDefault();

  if (isClick) return;

  setIsClick(true);

  const response = await fetch("/api/write", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });

  if (response.ok) {
    const textarea = document.querySelector("textarea");

    if (textarea) {
      textarea.value = "";
    }

    dispatch({ type: PostActionType.CLEAR });

    alert("Post created successfully!");

    router.push("/");
  } else {
    // 타이틀이 같으면 분기처리
    alert("Failed to create post.");
  }
};

export default handleSubmit;
