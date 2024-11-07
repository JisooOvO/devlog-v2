"use client";

import { RootState } from "@/lib/utils/store";
import { PostAction, PostActionType } from "@/lib/utils/reducers/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Dispatch as SetState, SetStateAction, useEffect } from "react";
import { Thumbnail } from "@prisma/client";
import Content from "@/lib/types/content";
import IconButton from "@/lib/components/iconButton";
import UploadIcon from "@/lib/icons/upload";
import ImageContainer from "../../imageContainer";
import useFetchData from "@/lib/hooks/useFetchData";
import "@/style/modal-write.css";

interface ModalWriteProps {
  setIsOpen: SetState<SetStateAction<boolean>>;
  thumbnails: Array<Thumbnail> | null;
}

const ModalWrite: React.FC<ModalWriteProps> = ({ setIsOpen, thumbnails }) => {
  const post = useSelector((state: RootState) => state.post);
  const dispatch: Dispatch<PostAction> = useDispatch();

  return (
    <div>
      <h2>글 저장하기</h2>
      <ThumbnailContainer
        post={post}
        dispatch={dispatch}
        thumbnails={thumbnails}
      />
      <Description post={post} dispatch={dispatch} />
      <ButtonConatiner post={post} dispatch={dispatch} setIsOpen={setIsOpen} />
    </div>
  );
};

// --------------------------------------------------------------------------

const size = "2rem";

interface ThumbProps {
  post: Content;
  dispatch: Dispatch<PostAction>;
  thumbnails: Array<Thumbnail> | null;
}

const ThumbnailContainer: React.FC<ThumbProps> = ({
  post,
  dispatch,
  thumbnails,
}) => {
  const { data, isLoading, fetchData } = useFetchData(
    "/api/admin/upload",
    "",
    false
  );

  useEffect(() => {
    if (data) {
      dispatch({
        type: PostActionType.SET_THUMBNAIL,
        payload: {
          thumbnail: {
            path: data,
          },
        },
      });

      const select = document.querySelector(
        "#modal-write-thumbnail-select"
      ) as HTMLSelectElement;

      select.value = data;
    }
  }, [data, dispatch]);

  return (
    <div className="modal-write-thumbnail-container">
      <p>썸네일</p>
      <div className="modal-write-thumbnail-selector">
        <select
          id="modal-write-thumbnail-select"
          value={post?.thumbnail?.path ?? ""}
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
            썸네일을 선택하세요.
          </option>
          {thumbnails?.map((thumb, index) => (
            <option key={`option${index}`} value={thumb.path}>
              {thumb.path.replace("/thumbnails/", "")}
            </option>
          ))}
          <option value={""}>썸네일 없음</option>
        </select>
      </div>
      <div className="modal-write-thumbnail-preview">
        {post?.thumbnail?.path ? (
          <ImageContainer
            width="100%"
            height="100%"
            src={post.thumbnail.path}
            alt="썸네일"
          />
        ) : (
          <>
            <label htmlFor="thumbnail">
              <IconButton description="">
                <UploadIcon width={size} height={size} />
              </IconButton>
              <p>Upload</p>
              <p>Thumbnail</p>
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={async (event) => {
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

                  if (!isLoading) {
                    fetchData({
                      method: "POST",
                      body: formData,
                    });
                  }
                }
              }}
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
    <div className="modal-write-description-container">
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
  const { data, isLoading, fetchData } = useFetchData(
    "/api/admin/posts",
    "",
    false
  );

  useEffect(() => {
    if (data) {
      setIsOpen(false);
      dispatch({ type: PostActionType.CLEAR });
      window.location.href = `/post/${data.replaceAll(" ", "-")}`;
    }
  }, [data, setIsOpen, dispatch]);

  return (
    <div className="modal-write-modal-button">
      <button
        className="custom-button"
        onClick={(e) => {
          e.preventDefault();

          if (!isLoading) {
            fetchData({
              method: "post",
              body: JSON.stringify({ post, published: true }),
            });
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
