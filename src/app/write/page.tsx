"use client";

import {
  Dispatch as SetState,
  SetStateAction,
  useState,
  MouseEventHandler,
  useEffect,
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
import ContentsView from "@/lib/components/contentsView";
import changeTopic from "./func/changeTopic";
import { useSession } from "next-auth/react";

const WritePage = () => {
  const newPost = useSelector((state: RootState) => state.post);
  const [isWrite, setIsWrite] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: Dispatch<PostAction> = useDispatch();
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    const email = data?.user?.email;

    if (status === "authenticated" && email) {
      dispatch({
        type: PostActionType.SET_AUTHOR,
        payload: {
          authorId: email,
        },
      });
    }
  }, [data, status]);

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
          <TopicSection
            title="주제"
            type="topics"
            dispatch={dispatch}
            actionType={PostActionType.SET_TOPIC}
          />
          <TopicSection
            title="시리즈"
            type="series"
            dispatch={dispatch}
            actionType={PostActionType.SET_SERIES}
          />
          <MarkdownEditor
            markdown={newPost.content}
            dispatch={dispatch}
            isWrite={isWrite}
            setIsWrite={setIsWrite}
          />
          <WriteButton setIsOpen={setIsOpen} />
        </form>
        <div className="preview">
          <ContentsView post={newPost} />
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
  type: "topics" | "series";
  dispatch: Dispatch<PostAction>;
  actionType: PostActionType.SET_TOPIC | PostActionType.SET_SERIES;
}

interface Topic extends Object {
  name: string;
}

const TopicSection: React.FC<TopicProps> = ({
  title,
  type,
  dispatch,
  actionType,
}) => {
  const [topics, setTopics] = useState<Array<Topic>>([]);
  const ADDTOPIC = "add-topic";

  useEffect(() => {
    const fetchTopics = async () => {
      const response = await fetch(`/api/${type}`);
      const jsonData = await response.json();
      const data = jsonData[type];
      setTopics(data);
    };
    fetchTopics();
  }, []);

  return (
    <div className="topic-container">
      <p>{title}</p>
      <div className="topic-selector">
        <select
          defaultValue={""}
          onChange={(event) => {
            const inputTag = event.target.nextElementSibling;

            switch (event.target.value) {
              case ADDTOPIC:
                inputTag?.classList.remove("hidden");
                break;
              default:
                inputTag?.classList.add("hidden");
                changeTopic({ event, actionType, dispatch });
                break;
            }
          }}
        >
          <option disabled value={""}>
            {title}를 선택하세요.
          </option>
          {topics.map((topic, index) => (
            <option key={`topic-${index}`} value={topic.name}>
              {topic.name}
            </option>
          ))}
          <option value={ADDTOPIC}>직접 입력</option>
        </select>
        <input
          type="text"
          className="hidden"
          onChange={(event) => changeTopic({ event, actionType, dispatch })}
          placeholder={`${title}를 입력하세요.`}
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
      <button className="custom-button" onClick={handleClick}>
        임시저장
      </button>
      <button className="custom-button" onClick={handleClick}>
        발행하기
      </button>
    </div>
  );
};

export default WritePage;
