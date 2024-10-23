import { PostAction, PostActionType } from "@/lib/utils/reducers/postReducer";
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
      alert("이미지 형식이 아닙니다.");
      return;
    }

    const formData = new FormData();
    formData.append("image", targetFile);
    formData.append("directory", "thumbnails");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    switch (response.status) {
      case 200:
        const data = await response.json();
        const path = data.path;
        dispatch({
          type: PostActionType.SET_THUMBNAIL,
          payload: {
            thumbnail: {
              path: path,
            },
          },
        });

        const select = document.querySelector(
          "#thumbnail-select"
        ) as HTMLSelectElement;

        select.value = path;
        break;
      default:
        const jsonData = await response.json();
        alert(jsonData["message"]);
        break;
    }
  }
};

export default handleOnChange;
