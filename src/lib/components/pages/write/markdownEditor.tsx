import Content from "@/lib/types/content";
import { PostAction, PostActionType } from "@/lib/utils/reducers/postReducer";
import { Dispatch, SetStateAction, useEffect } from "react";
import handleKeyUp from "../../../utils/functions/handleKeyUp";
import handleKeyDown from "../../../utils/functions/handleKeyDown";
import useFetchData from "@/lib/hooks/useFetchData";

const MARKDOWNAREA = "markdown-area";

interface mardownProps {
  post: Content;
  dispatch: Dispatch<PostAction>;
  isWrite: boolean;
  setIsWrite: Dispatch<SetStateAction<boolean>>;
}

const MarkdownEditor: React.FC<mardownProps> = ({
  isWrite,
  setIsWrite,
  post,
  dispatch,
}) => {
  const { data, isLoading, fetchData } = useFetchData(
    "/api/admin/upload",
    "",
    false
  );

  useEffect(() => {
    const handleDrop = async (event: DragEvent) => {
      event.preventDefault();

      const targetElement = event.target as HTMLElement;

      if (targetElement.id !== MARKDOWNAREA) return;

      const fileList = event.dataTransfer?.files;

      if (fileList && fileList.length > 0) {
        const targetFile = fileList[0];

        if (!targetFile.type.startsWith("image/")) return;

        const formData = new FormData();

        formData.append("image", targetFile);
        formData.append("directory", "images");

        if (!isLoading) {
          fetchData({
            method: "POST",
            body: formData,
          });
        }
      }
    };

    const handleDragover = (event: Event) => event.preventDefault();

    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragover);

    return () => {
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragover);
    };
  }, [fetchData, isLoading]);

  useEffect(() => {
    const textarea = document.querySelector(
      `#${MARKDOWNAREA}`
    ) as HTMLTextAreaElement;

    if (data) {
      textarea.value += `<img src="${data}" alt="글 이미지"/>`;
      dispatch({
        type: PostActionType.SET_CONTENTS,
        payload: { content: textarea.value },
      });
    }
  }, [data, dispatch]);

  return (
    <div className="markdown">
      <textarea
        value={post?.content}
        id={MARKDOWNAREA}
        className="markdown-area"
        spellCheck={false}
        onBlur={() => setIsWrite(false)}
        onKeyDown={(event) => handleKeyDown(event, isWrite)}
        onKeyUp={(event) => handleKeyUp(event, isWrite, setIsWrite)}
        onChange={(e) => {
          dispatch({
            type: PostActionType.SET_CONTENTS,
            payload: { content: e.target.value },
          });
        }}
        placeholder="글을 작성하세요."
      />
    </div>
  );
};

export default MarkdownEditor;
