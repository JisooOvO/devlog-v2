"use client";

import { RootState } from "@/lib/store";
import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Dispatch as SetState, SetStateAction } from "react";
import { Content } from "@/lib/components/constant/postProps";
import Image from "next/image";
import handleOnChange from "../func/uploadThumbnailFunc";
import { useRouter } from "next/navigation";

interface ModalWriteProps {
  setIsOpen: SetState<SetStateAction<boolean>>;
  thumbnails: Set<string>;
}

const ModalWrite: React.FC<ModalWriteProps> = ({ setIsOpen, thumbnails }) => {
  const post = useSelector((state: RootState) => state.post);
  const dispatch: Dispatch<PostAction> = useDispatch();
  return (
    <form>
      <h2>글 저장하기</h2>
      <ThumbnailContainer
        post={post}
        dispatch={dispatch}
        thumbnails={thumbnails}
      />
      <Description post={post} dispatch={dispatch} />
      <ButtonConatiner post={post} dispatch={dispatch} setIsOpen={setIsOpen} />
    </form>
  );
};

// --------------------------------------------------------------------------

interface ThumbProps {
  post: Content;
  dispatch: Dispatch<PostAction>;
  thumbnails: Set<string>;
}

const ThumbnailContainer: React.FC<ThumbProps> = ({
  post,
  dispatch,
  thumbnails,
}) => {
  return (
    <div className="thumbnail-container">
      <p>썸네일</p>
      <div className="thumbnail-selector">
        <select
          value={post?.thumbnail?.path}
          onChange={(e) => {
            dispatch({
              type: PostActionType.SET_THUMBNAIL,
              payload: {
                thumbnail: {
                  path: e.target.value,
                },
              },
            });
          }}
        >
          <option disabled value={""}>
            Thumbnail
          </option>
          {Array.from(thumbnails).map((path, index) => (
            <option key={`option${index}`} value={path}>
              {path.replace("/thumbnails/", "")}
            </option>
          ))}
        </select>
      </div>
      <div className="thumbnail-preview">
        {post?.thumbnail?.path ? (
          <Image
            className="post-thumbnail"
            src={post.thumbnail.path}
            alt="Thumbnail"
            width={100}
            height={100}
          />
        ) : (
          <>
            <label htmlFor="thumbnail">
              <p>Upload or Select</p>
              <p>Thumbnail</p>
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={(event) => handleOnChange({ event, dispatch })}
            />
          </>
        )}
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------

interface DescProps {
  post: Content;
  dispatch: Dispatch<PostAction>;
}

const Description: React.FC<DescProps> = ({ post, dispatch }) => {
  return (
    <div className="description-container">
      <p>소개</p>
      <textarea
        id="description"
        name="description"
        placeholder="글을 간략히 소개하세요."
        required
        value={post?.description}
        spellCheck={false}
        onChange={(event) => {
          dispatch({
            type: PostActionType.SET_DESCRIPTION,
            payload: { description: event.target.value },
          });
        }}
      />
    </div>
  );
};

// --------------------------------------------------------------------------

interface ButtonProps {
  post: Content;
  dispatch: Dispatch<PostAction>;
  setIsOpen: SetState<SetStateAction<boolean>>;
}

const ButtonConatiner: React.FC<ButtonProps> = ({
  post,
  dispatch,
  setIsOpen,
}) => {
  return (
    <div className="modal-button">
      <button
        className="custom-button"
        onClick={(e) => {
          e.preventDefault();
          const fetchData = async () => {
            const response = await fetch("/api/post", {
              method: "post",
              body: JSON.stringify({ post }),
            });

            switch (response.status) {
              case 200:
                alert("저장되었습니다.");
                setIsOpen(false);
                dispatch({ type: PostActionType.CLEAR });
                const jsonData = await response.json();
                window.location.href = `/post/${jsonData["title"]}`;
                break;
              default:
                alert("저장 안됨");
                break;
            }
          };

          if (post) {
            dispatch({
              type: PostActionType.SET_PUBLISHED,
              payload: {
                published: true,
              },
            });
            fetchData();
          }
        }}
      >
        발행하기
      </button>
      <button
        className="custom-button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(false);
        }}
      >
        취소하기
      </button>
    </div>
  );
};

export default ModalWrite;