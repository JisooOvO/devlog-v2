"use client";

import { PostAction, PostActionType } from "@/lib/utils/reducers/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import changeTopic from "../../../functions/changeTopic";
import { Topic } from "../../../../app/write/page";
import { Series } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

interface TopicProps {
  title: string;
  dispatch: Dispatch<PostAction>;
  actionType: PostActionType.SET_TOPIC | PostActionType.SET_SERIES;
  topics: Array<Topic> | Array<Series> | undefined;
  target: string | undefined;
}

const ADDTOPIC = "add-topic";

const TopicContainer: React.FC<TopicProps> = ({
  title,
  dispatch,
  actionType,
  topics,
  target,
}) => {
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const inputTag = selectRef.current?.nextElementSibling;

    if (topics === undefined && selectRef.current) {
      selectRef.current.value = ADDTOPIC;
      inputTag?.classList.remove("hidden");
    } else {
      inputTag?.classList.add("hidden");
    }
  }, [topics]);

  useEffect(() => {
    const selectValue = selectRef.current?.value;
    const inputTag = selectRef.current?.nextElementSibling;

    if (selectValue === ADDTOPIC || selectValue === "") {
      inputTag?.classList.remove("hidden");
    } else {
      inputTag?.classList.add("hidden");
    }
  }, [selectRef.current?.value]);

  return (
    <div>
      <p>{title}</p>
      <div className="topic-selector">
        <select
          ref={selectRef}
          value={inputValue ? ADDTOPIC : target}
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
                setInputValue("");
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
          onChange={(event) => {
            setInputValue(event.target.value);
            changeTopic({
              topicName: event.target.value,
              actionType,
              dispatch,
            });
          }}
          placeholder={`${title}를 입력하세요.`}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default TopicContainer;
