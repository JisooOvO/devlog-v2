"use client";

import {
  Dispatch as SetState,
  SetStateAction,
  useState,
  MouseEventHandler,
} from "react";
import MarkdownEditor from "./components/markdownEditor";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import handleSubmit from "./func/submitFunc";
import CustomModal from "@/lib/components/customModal";
import MarkdownView from "@/lib/components/markdownView";

const WritePage = () => {
  const newPost = useSelector((state: RootState) => state.post);
  const [isWrite, setIsWrite] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: Dispatch<PostAction> = useDispatch();
  const router = useRouter();

  return (
    <>
      <div className="write-container">
        <form
          className="write-form"
          onSubmit={(event) =>
            handleSubmit({
              event,
              isClick,
              setIsClick,
              router,
              newPost,
              dispatch,
            })
          }
        >
          <TitleInput
            title={newPost.title}
            dispatch={dispatch}
            setIsWrite={setIsWrite}
          />
          <TopicSection title="주제" />
          <TopicSection title="시리즈" />
          <MarkdownEditor
            markdown={newPost.content}
            dispatch={dispatch}
            isWrite={isWrite}
            setIsWrite={setIsWrite}
          />
          <WriteButton setIsOpen={setIsOpen} />
        </form>
        <div className="preview">
          <MarkdownView markdown={newPost.content} />
        </div>
      </div>
      <CustomModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

//-------------------------------------------------------------------

interface TitleProps {
  title: string | undefined;
  dispatch: Dispatch<PostAction>;
  setIsWrite: SetState<SetStateAction<boolean>>;
}

const TitleInput: React.FC<TitleProps> = ({ title, dispatch, setIsWrite }) => {
  return (
    <>
      <label htmlFor="title"></label>
      <input
        type="text"
        id="title"
        name="title"
        className="write-title"
        value={title}
        placeholder="제목"
        onChange={(e) =>
          dispatch({
            type: PostActionType.SET_TITLE,
            payload: { title: e.target.value },
          })
        }
        onKeyDown={(e) => {
          if (e.code === "Tab") {
            setIsWrite(false);
          }
        }}
        pattern="[a-zA-Z0-9ㄱ-ㅣ가-힣\s,.?!@#$%^&\(\)\{\}\[\]]{2,30}$"
        spellCheck={false}
        required
      />
    </>
  );
};

//-------------------------------------------------------------------

interface TopicProps {
  title: string;
}

const TopicSection: React.FC<TopicProps> = ({ title }) => {
  const ADDTOPIC = "add-topic";
  return (
    <div className="topic-container">
      <p>{title}</p>
      <div className="topic-selector">
        <select
          onChange={(event) => {
            const textarea = event.target.nextElementSibling;
            if (event.target.value == ADDTOPIC) {
              textarea?.classList.remove("hidden");
            } else {
              textarea?.classList.add("hidden");
            }
          }}
        >
          <option>{"뭔갈 넣어야함"}</option>
          <option value={ADDTOPIC}>직접 입력</option>
        </select>
        <textarea
          className="hidden"
          placeholder="직접 입력"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

//-------------------------------------------------------------------

interface WriteButtonProps {
  setIsOpen: SetState<SetStateAction<boolean>>;
}

const WriteButton: React.FC<WriteButtonProps> = ({ setIsOpen }) => {
  const handleClick: MouseEventHandler = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  return (
    <div className="write-button-container">
      <button className="write-button" onClick={handleClick}>
        임시저장
      </button>
      <button className="write-button" onClick={handleClick}>
        발행하기
      </button>
    </div>
  );
};

export default WritePage;
