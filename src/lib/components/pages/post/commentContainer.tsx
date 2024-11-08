"use client";

import "@/style/comment.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import getDateKoreanString from "@/lib/utils/functions/getDateKoreanString";
import IconButton from "@/lib/components/iconButton";
import DeleteIcon from "@/lib/icons/delete";
import EditIcon from "@/lib/icons/edit";
import LeftArrowIcon from "@/lib/icons/leftArrow";
import RightArrowIcon from "@/lib/icons/rightArrow";
import ImageContainer from "../../imageContainer";
import useFetchData from "@/lib/hooks/useFetchData";
import CommentWrite from "./commentWrite";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { defaultCommentTake } from "@/lib/constants/constants";

interface CommentProps {
  postId: string | undefined;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

export type keyCommnad = "delete" | "update" | "add" | "";

const CommentContainer: React.FC<CommentProps> = ({ postId }) => {
  const [comments, setComments] = useState<Map<string, Comment>>(new Map());
  const [changedKey, setChangedKey] = useState<[keyCommnad, Comment | null]>([
    "",
    null,
  ]);
  const [maximum, setMaximum] = useState<number>(defaultCommentTake);
  const [page, setPage] = useState<number>(1);

  const { data, fetchData } = useFetchData(
    `/api/public/comments`,
    {
      comments: new Array<Comment>(),
      maximum: 0,
    },
    false
  );

  useEffect(() => {
    if (postId) {
      fetchData({ method: "get" }, { page, postId });
    }
  }, [page, postId, fetchData]);

  useEffect(() => {
    if (data?.comments) {
      setComments((prev) => {
        const newComments = new Map(prev);
        for (let i = 0; i < data.comments.length; i++) {
          const targetComment = data.comments[i];
          if (!newComments.has(data.comments[i].id)) {
            newComments.set(targetComment.id, targetComment);
          }
        }

        const sortedComments = new Map(
          Array.from(newComments).sort((a, b) => a[0].localeCompare(b[0]))
        );

        return sortedComments;
      });
    }

    setMaximum(data?.maximum ?? 0);
  }, [data]);

  // 댓글 추가, 삭제
  useEffect(() => {
    if (changedKey) {
      setComments((prev) => {
        const newComments = new Map(prev);
        const commentKey = changedKey[0];
        const targetComment = changedKey[1];

        if (targetComment) {
          switch (commentKey) {
            case "add":
              newComments.set(targetComment.id, targetComment);
              setMaximum((prev) => prev + 1);
              break;
            case "delete":
              newComments.delete(targetComment.id);
              setMaximum((prev) => prev - 1);
              break;
            case "update":
              const updatedComment = newComments.get(targetComment.id);

              if (updatedComment) {
                updatedComment.content = targetComment.content;
              }
              break;
          }
        }

        return newComments;
      });
    }
  }, [changedKey, setMaximum]);

  // 댓글 페이지 자동 이동
  useEffect(() => {
    let targetPage = Math.ceil(maximum / defaultCommentTake);

    if (targetPage < 1) {
      targetPage = 1;
    }

    setPage(targetPage);
  }, [maximum, setPage]);

  if (!postId) return null;

  return (
    <div className="comment-layout">
      <CommentWrite postId={postId} setChangedKey={setChangedKey} />
      <CommentList
        page={page}
        commentList={comments}
        changedKey={changedKey}
        setChangedKey={setChangedKey}
      />
      <CommentPagingContainer
        page={page}
        maximum={maximum ?? 0}
        setPage={setPage}
      />
      <hr />
    </div>
  );
};

// --------------------------------------------------------------------------

interface CommentPagingContainerProps {
  page: number;
  maximum: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const CommentPagingContainer: React.FC<CommentPagingContainerProps> = ({
  page,
  maximum,
  setPage,
}) => {
  return (
    <div className="comment-page-container">
      {page > 1 ? (
        <IconButton
          description="이전"
          onClick={() => {
            setPage(page > 1 ? page - 1 : 1);
          }}
        >
          <LeftArrowIcon width={size} height={size} />
        </IconButton>
      ) : (
        <div></div>
      )}
      <p>{page}</p>
      {page * defaultCommentTake < maximum ? (
        <IconButton
          description="다음"
          onClick={() => {
            setPage(page + 1);
          }}
        >
          <RightArrowIcon width={size} height={size} />
        </IconButton>
      ) : (
        <div></div>
      )}
    </div>
  );
};

// --------------------------------------------------------------------------

interface CommentListProps {
  page: number;
  commentList?: Map<string, Comment>;
  changedKey: [keyCommnad, Comment | null];
  setChangedKey: Dispatch<SetStateAction<[keyCommnad, Comment | null]>>;
}

const size = "1.5rem";

const CommentList: React.FC<CommentListProps> = ({
  page,
  commentList,
  changedKey,
  setChangedKey,
}) => {
  const newCommentRef = useRef<HTMLDivElement | null>(null);

  const { data: session } = useSession();

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
  }, [fetchData, session?.user?.email]);

  useEffect(() => {
    if (newCommentRef.current && changedKey[0] === "add") {
      const commentPosition =
        newCommentRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: commentPosition - 8 * 16,
        behavior: "instant",
      });
    }
  }, [changedKey, newCommentRef]);

  const pagingCommentList = Array.from(commentList?.values()!).slice(
    (page - 1) * 10,
    page * 10
  );

  return (
    <div className="comment-list">
      {pagingCommentList.map((comment, index) => {
        if (!comment?.user) return;

        return (
          <div
            className="comment"
            key={`comment${index}`}
            ref={index === pagingCommentList.length - 1 ? newCommentRef : null}
          >
            <CommentHeader
              commentList={commentList}
              comment={comment}
              session={session}
              role={role}
              index={index}
              setChangedKey={setChangedKey}
            />
            <p id={`comment${index}`} className="comment-content">
              {comment.content}
            </p>
            <div id={`commentEdit${index}`} className="comment-edit hidden">
              <textarea
                spellCheck={false}
                className="comment-content"
                placeholder={comment.content}
                onFocus={(e) => {
                  e.target.value = comment.content;
                }}
                onChange={(e) => {
                  comment.content = e.target.value;
                }}
              />
              <CommentRegisterButton
                comment={comment}
                index={index}
                setChangedKey={setChangedKey}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

//----------------------------------------------------------

interface CommentHeaderProps {
  commentList: Map<string, Comment> | undefined;
  comment: Comment;
  session: Session | null;
  role: string | null;
  index: number;
  setChangedKey: Dispatch<SetStateAction<[keyCommnad, Comment | null]>>;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({
  comment,
  session,
  role,
  index,
  setChangedKey,
}) => {
  const {
    data: deletedComment,
    isLoading,
    fetchData,
  } = useFetchData("/api/user/comments", null, false);

  useEffect(() => {
    if (deletedComment) {
      setChangedKey(() => ["delete", deletedComment]);
    }
  }, [deletedComment, setChangedKey]);

  return (
    <div className="comment-user-container">
      <div className="comment-user-info">
        <div className="comment-user-image">
          <ImageContainer
            width="1.5rem"
            height="1.5rem"
            src={comment.user?.image}
            alt="유저 이미지"
          />
        </div>
        <p>{comment.user.name ?? ""}</p>
        <p className="comment-date">
          {getDateKoreanString(new Date(comment.createdAt), true)}
        </p>
      </div>
      <div className="comment-controller">
        {session?.user?.email === comment.user.email ? (
          <IconButton
            description="수정하기"
            onClick={() => {
              const p = document.querySelector(`#comment${index}`);
              const textarea = document.querySelector(`#commentEdit${index}`);

              p?.classList.toggle("hidden");
              textarea?.classList.toggle("hidden");
            }}
          >
            <EditIcon width={size} height={size} />
          </IconButton>
        ) : (
          <div></div>
        )}
        {role === "owner" || session?.user?.email === comment.user.email ? (
          <IconButton
            description="삭제하기"
            onClick={() => {
              if (!confirm("정말로 삭제하시겠습니까?")) return;

              if (!isLoading) {
                fetchData({
                  method: "DELETE",
                  body: JSON.stringify({
                    comment,
                    email: session?.user?.email,
                  }),
                });
              }
            }}
          >
            <DeleteIcon width={size} height={size} />
          </IconButton>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

//----------------------------------------------------------

interface CommentRegisterProps {
  comment: Comment;
  index: number;
  setChangedKey: Dispatch<SetStateAction<[keyCommnad, Comment | null]>>;
}

const CommentRegisterButton: React.FC<CommentRegisterProps> = ({
  comment,
  index,
  setChangedKey,
}) => {
  const {
    data: updatedComment,
    isLoading,
    fetchData,
  } = useFetchData("/api/user/comments", null, false);

  const { data: session } = useSession();

  useEffect(() => {
    if (updatedComment) {
      const p = document.querySelector(`#comment${index}`);
      const textarea = document.querySelector(`#commentEdit${index}`);

      p?.classList.remove("hidden");
      textarea?.classList.add("hidden");

      setChangedKey(() => ["update", updatedComment]);
    }
  }, [index, setChangedKey, updatedComment]);

  return (
    <button
      className="custom-button"
      onClick={() => {
        if (comment.content.length <= 0) return;

        if (!isLoading) {
          fetchData({
            method: "put",
            body: JSON.stringify({ comment, email: session?.user?.email }),
          });
        }
      }}
    >
      등록
    </button>
  );
};

export default CommentContainer;
