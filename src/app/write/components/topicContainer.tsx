"use client";

import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import changeTopic from "../func/changeTopic";
import { Topic } from "../page";
import { Content } from "@/lib/constant/postProps";
import { Series } from "@prisma/client";
import { useEffect, useRef } from "react";

interface TopicProps {
  title: string;
  dispatch: Dispatch<PostAction>;
  actionType: PostActionType.SET_TOPIC | PostActionType.SET_SERIES;
  topics: Array<Topic> | Array<Series> | undefined;
}

const ADDTOPIC = "add-topic";

const TopicContainer: React.FC<TopicProps> = ({
  title,
  dispatch,
  actionType,
  topics,
}) => {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (topics === undefined && selectRef.current) {
      selectRef.current.value = ADDTOPIC;
      const inputTag = selectRef.current?.nextElementSibling;
      inputTag?.classList.remove("hidden");
    }
  }, [topics]);

  useEffect(() => {
    const selectValue = selectRef.current?.value;

    if (selectValue === ADDTOPIC) {
      const inputTag = selectRef.current?.nextElementSibling;
      inputTag?.classList.remove("hidden");
    }
  }, [selectRef]);

  return (
    <div>
      <p>{title}</p>
      <div className="topic-selector">
        <select
          ref={selectRef}
          onChange={(event) => {
            const inputTag = event.target.nextElementSibling;

            switch (event.target.value) {
              case ADDTOPIC:
                inputTag?.classList.remove("hidden");
                changeTopic({
                  topicName: "",
                  actionType,
                  dispatch,
                });
                break;
              default:
                inputTag?.classList.add("hidden");
                changeTopic({
                  topicName: event.target.value,
                  actionType,
                  dispatch,
                });
                break;
            }
          }}
        >
          <option disabled value={""}>
            {title}를 선택하세요.
          </option>
          {topics?.map((topic, index) => (
            <option key={`topic-${index}`} value={topic.name}>
              {topic.name}
            </option>
          ))}
          <option value={ADDTOPIC}>직접 입력</option>
        </select>
        <input
          type="text"
          className="hidden"
          onChange={(event) =>
            changeTopic({ topicName: event.target.value, actionType, dispatch })
          }
          placeholder={`${title}를 입력하세요.`}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default TopicContainer;
