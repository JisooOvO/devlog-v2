"use client";

import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import changeTopic from "../func/changeTopic";
import { Topic } from "../page";
import { Content } from "@/lib/constant/postProps";
import { Series } from "@prisma/client";

interface TopicProps {
  post: Content;
  type: "topic" | "series";
  title: string;
  dispatch: Dispatch<PostAction>;
  actionType: PostActionType.SET_TOPIC | PostActionType.SET_SERIES;
  topics: Array<Topic> | Array<Series>;
}

const ADDTOPIC = "add-topic";

const TopicContainer: React.FC<TopicProps> = ({
  post,
  type,
  title,
  dispatch,
  actionType,
  topics,
}) => {
  // const [selectValue, setSelectValue] = useState<string>("");

  // useEffect(() => {
  //   setSelectValue("");
  // }, [topics]);

  const target = post?.[type];

  return (
    <div>
      <p>{title}</p>
      <div className="topic-selector">
        <select
          value={target?.name}
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

export default TopicContainer;
