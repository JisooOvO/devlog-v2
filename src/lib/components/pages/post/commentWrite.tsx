"use client";

import useFetchData from "@/lib/hooks/useFetchData";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Comment, keyCommnad } from "./commentContainer";
interface Props {
  postId: string | undefined;
  setChangedKey: Dispatch<SetStateAction<[keyCommnad, Comment | null]>>;
}

const CommentWrite: React.FC<Props> = ({ postId, setChangedKey }) => {
  const [comment, setComment] = useState<string>("");
  const { data: session } = useSession();
  const {
    data: newComment,
    isLoading,
    fetchData,
  } = useFetchData("/api/user/comments", null, false);

  useEffect(() => {
    if (newComment) {
      setChangedKey(() => ["add", newComment]);
      setComment("");
    }
  }, [newComment]);

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

            if (comment.length <= 0 || isLoading) return;

            fetchData({
              method: "POST",
              body: JSON.stringify({
                comment,
                postId,
                email: session?.user?.email,
              }),
            });
          }}
        >
          등록
        </button>
      </form>
    </div>
  );
};

export default CommentWrite;
