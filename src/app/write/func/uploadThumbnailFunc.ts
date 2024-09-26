import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import { ChangeEvent } from "react";

interface Props {
  event: ChangeEvent;
  dispatch: Dispatch<PostAction>;
}

const handleOnChange = async ({ event, dispatch }: Props) => {
  const target = event.target as HTMLInputElement;

  if (target.files) {
    const targetFile = target.files[0];
    if (!targetFile?.type.startsWith("image/")) {
      alert("이미지를 업로드하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("image", targetFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.status === 200) {
      const data = await response.json();
      const path = data.path;
      dispatch({
        type: PostActionType.SET_THUMBNAIL,
        payload: {
          thumbnail: path,
        },
      });
    }
  }
};

export default handleOnChange;
