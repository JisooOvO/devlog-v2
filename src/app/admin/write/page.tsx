"use client";

import {
  Dispatch as SetState,
  SetStateAction,
  useState,
  useEffect,
  useRef,
} from "react";
import MarkdownEditor from "../../../lib/components/pages/write/markdownEditor";
import CustomModal from "@/lib/components/customModal";
import ContentsView from "@/lib/components/contentsView";
import TopicContainer from "../../../lib/components/pages/write/topicContainer";
import Content from "@/lib/types/content";
import ModalWrite from "../../../lib/components/pages/write/modalWrite";
import useFetchData from "@/lib/hooks/useFetchData";
import changeTopic from "../../../lib/utils/functions/changeTopic";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/utils/store";
import { PostAction, PostActionType } from "@/lib/utils/reducers/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import { useSession } from "next-auth/react";
import { Series, Thumbnail } from "@prisma/client";
import "@/style/write.css";

const WritePage = () => {
  const newPost = useSelector((state: RootState) => state.post);
  const [isWrite, setIsWrite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const dispatch: Dispatch<PostAction> = useDispatch();

  const { data: thumbnails } = useFetchData(
    "/api/admin/thumbnails",
    new Array<Thumbnail>()
  );

  useEffect(() => {
    if (status === "authenticated" && session) {
      dispatch({
        type: PostActionType.SET_AUTHOR,
        payload: {
          author: session.user,
        },
      });
    }
  }, [session, status, dispatch]);

  return (
    <>
      <div className="write-container">
        <form className="write-form">
          <TitleInput
            title={newPost?.title}
            dispatch={dispatch}
            setIsWrite={setIsWrite}
          />
          <TopicSection post={newPost} dispatch={dispatch} />
          <MarkdownEditor
            post={newPost}
            dispatch={dispatch}
            isWrite={isWrite}
            setIsWrite={setIsWrite}
          />
          <WriteButton setIsOpen={setIsOpen} />
          <CustomModal isOpen={isOpen}>
            <ModalWrite setIsOpen={setIsOpen} thumbnails={thumbnails} />
          </CustomModal>
        </form>
        <div className="preview">
          <ContentsView post={newPost} />
        </div>
      </div>
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <label htmlFor="title"></label>
      <input
        type="text"
        id="title"
        name="title"
        ref={inputRef}
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
        // pattern="[a-zA-Z0-9ㄱ-ㅣ가-힣\s,.!@#$%^&\(\)\{\}\[\]]{2,30}$"
        spellCheck={false}
      />
    </>
  );
};

//-------------------------------------------------------------------

interface TopicProps {
  post: Content;
  dispatch: Dispatch<PostAction>;
}

export interface Topic {
  name: string;
  series: Array<Series>;
}

const TopicSection: React.FC<TopicProps> = ({ post, dispatch }) => {
  const { data: topics } = useFetchData(
    "/api/admin/topics",
    new Array<Topic>()
  );
  const [index, setIndex] = useState<number>(-1);

  useEffect(() => {
    if (post?.topic?.name.length === 0) {
      changeTopic({
        topicName: "",
        actionType: PostActionType.SET_SERIES,
        dispatch,
      });
    }

    if (topics == null) return;

    for (let i = 0; i < topics.length; i++) {
      if (post?.topic?.name === topics[i].name) {
        setIndex(i);
        break;
      } else {
        setIndex(-1);
      }
    }
  }, [topics, post?.topic, dispatch]);

  return (
    <>
      <TopicContainer
        title="주제"
        dispatch={dispatch}
        actionType={PostActionType.SET_TOPIC}
        topics={topics}
        target={post?.topic?.name}
      />
      <TopicContainer
        title="시리즈"
        dispatch={dispatch}
        actionType={PostActionType.SET_SERIES}
        topics={topics?.[index]?.series}
        target={post?.series?.name}
      />
    </>
  );
};

//-------------------------------------------------------------------

interface WriteButtonProps {
  setIsOpen: SetState<SetStateAction<boolean>>;
}

const WriteButton: React.FC<WriteButtonProps> = ({ setIsOpen }) => {
  return (
    <div className="write-button-container">
      <button
        className="custom-button"
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(true);
        }}
      >
        발행하기
      </button>
    </div>
  );
};

export default WritePage;
