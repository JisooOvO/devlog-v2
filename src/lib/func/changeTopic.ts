import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch } from "@reduxjs/toolkit";

interface Props {
  topicName: string;
  dispatch: Dispatch<PostAction>;
  actionType: PostActionType.SET_TOPIC | PostActionType.SET_SERIES;
}

const changeTopic = ({ topicName, actionType, dispatch }: Props) => {
  switch (actionType) {
    case PostActionType.SET_TOPIC:
      dispatch({
        type: actionType,
        payload: {
          topic: {
            name: topicName,
          },
        },
      });
      break;
    case PostActionType.SET_SERIES:
      dispatch({
        type: actionType,
        payload: {
          series: {
            name: topicName,
          },
        },
      });
      break;
  }
};

export default changeTopic;
