import { PostAction, PostActionType } from "@/lib/store/postReducer";
import { Dispatch } from "@reduxjs/toolkit";
import { ChangeEvent } from "react";

interface Props {
  event: ChangeEvent<HTMLSelectElement | HTMLInputElement>;
  dispatch: Dispatch<PostAction>;
  actionType: PostActionType.SET_TOPIC | PostActionType.SET_SERIES;
}

const changeTopic = ({ event, actionType, dispatch }: Props) => {
  switch (actionType) {
    case PostActionType.SET_TOPIC:
      dispatch({
        type: actionType,
        payload: {
          topic: event.target.value,
        },
      });
      break;
    case PostActionType.SET_SERIES:
      dispatch({
        type: actionType,
        payload: {
          series: event.target.value,
        },
      });
  }
};

export default changeTopic;
