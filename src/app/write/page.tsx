"use client";

import { useState } from "react";
import MarkdownEditor from "../../lib/components/write/markdownEditor";
import { useRouter } from "next/navigation";
import TitleInput from "@/lib/components/write/titleInput";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch } from "@reduxjs/toolkit";

const WritePage = () => {
  const newPost = useSelector((state: RootState) => state.post);
  const [isWrite, setIsWrite] = useState(false);
  const dispatch: Dispatch<PostAction> = useDispatch();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
      alert("Failed to create post.");
    }
  };

  return (
    <form className="write-form" onSubmit={handleSubmit}>
      <TitleInput
        title={newPost.title}
        dispatch={dispatch}
        setIsWrite={setIsWrite}
      />
      <MarkdownEditor
        markdown={newPost.content}
        dispatch={dispatch}
        isWrite={isWrite}
        setIsWrite={setIsWrite}
      />
      <button className="write-button" type="submit">
        SAVE
      </button>
    </form>
  );
};

export default WritePage;
