"use client";

import "@/style/comment.css";
import CommentWrite from "./commentWrite";
import { User } from "@prisma/client";
import Image from "next/image";
import { PLACEHOLDER } from "@/lib/utils/constants/imageProps";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import getDateKoreanString from "@/lib/utils/functions/getDateKoreanString";
import IconButton from "@/lib/components/iconButton";
import DeleteIcon from "@/lib/icons/delete";
import EditIcon from "@/lib/icons/edit";
import LeftArrowIcon from "@/lib/icons/leftArrow";
import RightArrowIcon from "@/lib/icons/rightArrow";
import { useSession } from "next-auth/react";
import checkAuth from "@/lib/utils/functions/checkAuth";

interface CommentProps {
  postId: string | undefined;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

const CommentContainer: React.FC<CommentProps> = ({ postId }) => {
  const [commentList, setCommentList] = useState<Array<Comment>>([]);
  const [hasNewContent, setHasNewContent] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [maximum, setMaximum] = useState<number>(0);

  useEffect(() => {
    if (postId) {
      const fetchData = async () => {
        const response = await fetch(`/api/comment?page=${page}`);
        const jsonData = await response.json();
        const comments: Array<Comment> = jsonData["comments"];
        setCommentList(comments);
        setMaximum(jsonData["maximum"]);
      };

      fetchData();
    }
  }, [page, postId]);

  if (!postId) return null;

  return (
    <div className="comment-layout">
      <CommentWrite
        postId={postId}
        setCommentList={setCommentList}
        setHasNewContent={setHasNewContent}
      />
      <CommentList
        commentList={commentList}
        setCommentList={setCommentList}
        hasNewContent={hasNewContent}
        setHasNewContent={setHasNewContent}
      />
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
        {page * 10 < maximum ? (
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
      <hr />
    </div>
  );
};

// --------------------------------------------------------------------------

interface CommentListProps {
  commentList: Array<Comment>;
  setCommentList: Dispatch<SetStateAction<Array<Comment>>>;
  hasNewContent: boolean;
  setHasNewContent: Dispatch<SetStateAction<boolean>>;
}

const size = "1.5rem";

const CommentList: React.FC<CommentListProps> = ({
  commentList,
  setCommentList,
  hasNewContent,
  setHasNewContent,
}) => {
  const [comments, setComments] = useState<ReactNode>(null);
  const [isClick, setIsClick] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const newCommentRef = useRef<HTMLDivElement | null>(null);

  const { data } = useSession();

  useEffect(() => {
    const checkEmail = async () => {
      if (await checkAuth(data?.user?.email)) setIsOwner(true);
    };

    checkEmail();
  }, [data]);

  useEffect(() => {
    if (newCommentRef.current) {
      const commentPosition =
        newCommentRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: commentPosition - 8 * 16,
        behavior: "instant",
      });

      setHasNewContent(false);
    }
  }, [hasNewContent, setHasNewContent]);

  useEffect(() => {
    const commentsElements = commentList?.map((comment, index) => {
      if (!comment?.user) return;
      return (
        <div
          className="comment"
          key={`comment${index}`}
          ref={index === commentList.length - 1 ? newCommentRef : null}
        >
          <div className="comment-user-container">
            <div className="comment-user-info">
              <div className="comment-user-image">
                <Image
                  src={comment.user?.image ?? PLACEHOLDER}
                  alt="user image"
                  fill
                  sizes="100% 100%"
                />
              </div>
              <p>{comment.user.name ?? ""}</p>
              <p className="comment-date">
                {getDateKoreanString(new Date(comment.createdAt), true)}
              </p>
            </div>
            <div className="comment-controller">
              {data?.user?.email === comment.user.email ? (
                <IconButton
                  description="수정하기"
                  onClick={() => {
                    const p = document.querySelector(`#comment${index}`);
                    const textarea = document.querySelector(
                      `#commentEdit${index}`
                    ) as HTMLTextAreaElement;
                    p?.classList.toggle("hidden");
                    textarea.classList.toggle("hidden");
                  }}
                >
                  <EditIcon width={size} height={size} />
                </IconButton>
              ) : (
                <div></div>
              )}
              {isOwner || data?.user?.email === comment.user.email ? (
                <IconButton
                  description="삭제하기"
                  onClick={() => {
                    const fetchData = async () => {
                      const response = await fetch("/api/comment", {
                        method: "DELETE",
                        body: JSON.stringify({ comment }),
                      });

                      const jsonData = await response.json();

                      switch (response.status) {
                        case 200:
                          setCommentList((prev) => {
                            return [...prev.filter((c) => c.id !== comment.id)];
                          });
                          break;
                        default:
                          alert(jsonData["message"]);
                          break;
                      }
                    };

                    if (confirm("정말로 삭제하시겠습니까?")) fetchData();
                  }}
                >
                  <DeleteIcon width={size} height={size} />
                </IconButton>
              ) : (
                <div></div>
              )}
            </div>
          </div>
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
            <button
              className="custom-button"
              onClick={() => {
                const fetchData = async () => {
                  if (comment.content.length <= 0 || isClick) return;

                  setIsClick(true);

                  const response = await fetch("/api/comment", {
                    method: "PUT",
                    body: JSON.stringify({ comment }),
                  });

                  const jsonData = await response.json();

                  switch (response.status) {
                    case 200:
                      setCommentList((prev) => [...prev]);
                      const p = document.querySelector(`#comment${index}`);
                      const textarea = document.querySelector(
                        `#commentEdit${index}`
                      );
                      p?.classList.remove("hidden");
                      textarea?.classList.add("hidden");
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
          </div>
        </div>
      );
    });

    setComments(commentsElements);
  }, [commentList, data?.user?.email, isClick, isOwner, setCommentList]);

  return <div className="comment-list">{comments}</div>;
};

export default CommentContainer;
