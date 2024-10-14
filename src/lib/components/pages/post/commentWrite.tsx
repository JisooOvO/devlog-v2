"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Comment } from "./commentContainer";

interface Props {
  postId: string | undefined;
  setCommentList: Dispatch<SetStateAction<Array<Comment>>>;
  setHasNewContent: Dispatch<SetStateAction<boolean>>;
}

const CommentWrite: React.FC<Props> = ({
  postId,
  setCommentList,
  setHasNewContent,
}) => {
  const [comment, setComment] = useState<string>("");
  const [isClick, setIsClick] = useState<boolean>(false);

  return (
    <div className="comment-write">
      <form className="comment-text">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          spellCheck={false}
          placeholder="댓글을 입력하실 수 있습니다."
        />
        <button
          className="custom-button"
          onClick={(e) => {
            e.preventDefault();

            const fetchData = async () => {
              if (comment.length <= 0 || isClick) return;

              setIsClick(true);

              const response = await fetch("/api/comment", {
                method: "POST",
                body: JSON.stringify({ comment, postId }),
              });

              const jsonData = await response.json();

              switch (response.status) {
                case 200:
                  setComment("");
                  setHasNewContent(true);
                  setCommentList((prev) => {
                    return [...prev, jsonData["newComment"]];
                  });
                  break;
                default:
                  alert(jsonData["message"]);
              }

              setIsClick(false);
            };

            fetchData();
          }}
        >
          등록
        </button>
      </form>
    </div>
  );
};

export default CommentWrite;
