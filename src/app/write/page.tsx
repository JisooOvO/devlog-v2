"use client";

import {
  Dispatch as SetState,
  SetStateAction,
  useState,
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
import { useSession } from "next-auth/react";
import TopicContainer from "./components/topicContainer";
import { Content } from "@/lib/constant/postProps";
import { Series, Thumbnail } from "@prisma/client";
import ModalWrite from "./components/modalWrite";
import "@/style/write.css";

const WritePage = () => {
  const newPost = useSelector((state: RootState) => state.post);
  const [isWrite, setIsWrite] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: Dispatch<PostAction> = useDispatch();
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    const name = data?.user?.name;
    const email = data?.user?.email;
    const image = data?.user?.image;

    if (status === "authenticated" && name && email && image) {
      dispatch({
        type: PostActionType.SET_AUTHOR,
        payload: {
          author: {
            name: name,
            email: email,
            image: image,
          },
        },
      });
    }
  }, [data, status, dispatch]);

  const [thumbnails, setThumbnails] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchThumbnails = async () => {
      const response = await fetch("/api/thumbnails");
      const data = await response.json();
      const thumbs: Array<Thumbnail> = data.thumbnails ?? [];
      setThumbnails(
        (prev) =>
          new Set([...Array.from(prev), ...thumbs?.map((thumb) => thumb.path)]),
      );
    };

    fetchThumbnails();
  }, [newPost?.thumbnail?.path]);

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
          <WriteButton post={newPost} setIsOpen={setIsOpen} />
        </form>
        <div className="preview">
          <ContentsView post={newPost} />
        </div>
      </div>
      <CustomModal isOpen={isOpen}>
        <ModalWrite setIsOpen={setIsOpen} thumbnails={thumbnails} />
      </CustomModal>
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
  post: Content;
  dispatch: Dispatch<PostAction>;
}

export interface Topic {
  name: string;
  series: Array<Series>;
}

const TopicSection: React.FC<TopicProps> = ({ post, dispatch }) => {
  const [topics, setTopics] = useState<Array<Topic>>([]);
  const [series, setSeries] = useState<Array<Series>>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const response = await fetch(`/api/topics`);
      const jsonData = await response.json();
      setTopics(jsonData["topics"]);
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    topics?.forEach((topic) => {
      if (topic.name === post?.topic?.name) {
        setSeries(topic.series);

        let flag = false;

        for (let i = 0; i < topic.series.length; i++) {
          if (topic.series[i].name === post.series?.name) {
            flag = true;
            break;
          }
        }

        dispatch({
          type: PostActionType.SET_SERIES,
          payload: {
            series: {
              name: flag ? post?.series?.name : "",
            },
          },
        });
      }
    });
  }, [post?.series?.name, post?.topic, dispatch, topics]);

  return (
    <>
      <TopicContainer
        post={post}
        title="주제"
        type="topic"
        dispatch={dispatch}
        actionType={PostActionType.SET_TOPIC}
        topics={topics}
      />
      <TopicContainer
        post={post}
        type="series"
        title="시리즈"
        dispatch={dispatch}
        actionType={PostActionType.SET_SERIES}
        topics={series}
      />
    </>
  );
};

//-------------------------------------------------------------------

interface WriteButtonProps {
  post: Content;
  setIsOpen: SetState<SetStateAction<boolean>>;
}

const WriteButton: React.FC<WriteButtonProps> = ({ post, setIsOpen }) => {
  return (
    <div className="write-button-container">
      {post?.id === undefined ? (
        <button
          className="custom-button"
          onClick={(e) => {
            e.preventDefault();

            const fetchData = async () => {
              const response = await fetch("/api/write", {
                method: "post",
                body: JSON.stringify({ post }),
              });

              switch (response.status) {
                case 200:
                  alert("임시 저장되었습니다.");
                  break;
                default:
                  alert("저장 안됨");
                  break;
              }
            };

            fetchData();
          }}
        >
          임시저장
        </button>
      ) : null}
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
