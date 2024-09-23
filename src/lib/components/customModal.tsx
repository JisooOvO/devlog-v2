import handleOnChange from "@/app/write/func/uploadThumbnailFunc";
import { RootState } from "@/lib/store";
import { NewPost, PostAction, PostActionType } from "@/lib/store/postReducer";
import { Thumbnail } from "@prisma/client";
import { Dispatch } from "@reduxjs/toolkit";
import Image from "next/image";
import {
  Dispatch as SetState,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

interface CustomModalProps {
  isOpen: boolean;
  setIsOpen: SetState<SetStateAction<boolean>>;
}

interface Props {
  post: NewPost;
  dispatch: Dispatch<PostAction>;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, setIsOpen }) => {
  const post = useSelector((state: RootState) => state.post);
  const dispatch: Dispatch<PostAction> = useDispatch();

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <form>
          <h2>글 저장하기</h2>
          <Thumbnail post={post} dispatch={dispatch} />
          <Description post={post} dispatch={dispatch} />
          <div className="modal-button">
            <button onClick={() => setIsOpen(false)}>CLOSE</button>
            <button onClick={() => {}}>SAVE</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------

const Thumbnail: React.FC<Props> = ({ post, dispatch }) => {
  const [thumbnails, setThumbnails] = useState<Set<string>>(new Set());

  // TODO : API를 더 일찍 호출
  useEffect(() => {
    const fetchThumbnails = async () => {
      const response = await fetch("/api/thumbnails");
      const data = await response.json();
      const thumbs: Array<Thumbnail> = data.thumbnails;
      setThumbnails(
        (prev) =>
          new Set([...Array.from(prev), ...thumbs.map((thumb) => thumb.path)])
      );
    };
    fetchThumbnails();
  }, [post.thumbnail]);

  return (
    <div className="thumbnail-container">
      <p>썸네일</p>
      <div className="thumbnail-selector">
        <select
          value={post.thumbnail as string}
          onChange={(e) => {
            dispatch({
              type: PostActionType.SET_THUMBNAIL,
              payload: {
                thumbnail: e.target.value,
              },
            });
          }}
        >
          <option selected disabled value={""}>
            select thumbnail
          </option>
          {Array.from(thumbnails).map((path, index) => (
            <option key={`option${index}`} value={path}>
              {path.replace("/thumbnails/", "")}
            </option>
          ))}
        </select>
      </div>
      <div className="thumbnail-preview">
        {post.thumbnail ? (
          <Image
            className="post-thumbnail"
            src={post.thumbnail as string}
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

const Description: React.FC<Props> = ({ post, dispatch }) => {
  return (
    <div className="description-container">
      <p>글 설명</p>
      <textarea
        id="description"
        name="description"
        placeholder="글 설명을 입력하세요."
        required
        value={post.description}
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

export default CustomModal;
