import { Content } from "@/lib/constant/postProps";
import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import handleKeyUp from "../func/handleKeyUp";
import handleKeyDown from "../func/handleKeyDown";
import dragEndCallback, { MARKDOWNAREA } from "../func/dragEndCallback";

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
  const [img, setImg] = useState<string>("");

  useEffect(() => {
    const handleDrop = (event: Event) =>
      dragEndCallback(event as DragEvent, setImg);
    const handleDragover = (event: Event) => event.preventDefault();

    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragover);

    return () => {
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragover);
    };
  }, []);

  useEffect(() => {
    const textarea = document.querySelector(
      `#${MARKDOWNAREA}`,
    ) as HTMLTextAreaElement;

    if (img.length !== 0) {
      textarea.value += `<img src="${img}" alt="글 이미지"/>`;
      dispatch({
        type: PostActionType.SET_CONTENTS,
        payload: { content: textarea.value },
      });
      setImg("");
    }
  }, [img, dispatch]);

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
