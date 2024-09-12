import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import {
  Dispatch as SetState,
  KeyboardEventHandler,
  SetStateAction,
} from "react";

interface TitleProps {
  title: string | undefined;
  dispatch: Dispatch<PostAction>;
  setIsWrite: SetState<SetStateAction<boolean>>;
}

const TitleInput: React.FC<TitleProps> = ({ title, dispatch, setIsWrite }) => {
  const handleKeydown: KeyboardEventHandler = (event) => {
    if (event.code === "Tab") {
      setIsWrite(false);
    }
  };

  return (
    <>
      <label htmlFor="title"></label>
      <input
        type="text"
        className="write-title"
        value={title}
        placeholder="제목"
        onChange={(e) =>
          dispatch({
            type: PostActionType.SET_TITLE,
            payload: { title: e.target.value },
          })
        }
        onKeyDown={handleKeydown}
        pattern="[a-zA-Z0-9ㄱ-ㅣ가-힣\s,.?!@#$%^&\(\)\{\}\[\]]{2,30}$"
        spellCheck={false}
        required
      />
    </>
  );
};

export default TitleInput;
