import { UnknownAction } from "@reduxjs/toolkit";

export interface NewPost {
  title?: string;
  thumbnail?: string | ArrayBuffer | null | undefined;
  description?: string;
  content?: string;
  topic?: string;
  series?: string;
  authorId?: string | null;
}

export enum PostActionType {
  CLEAR = "clear",
  SET_TITLE = "set_title",
  SET_CONTENTS = "set_contents",
  SET_THUMBNAIL = "set_thumbnail",
  SET_DESCRIPTION = "set_description",
  SET_TOPIC = "set_topic",
  SET_SERIES = "set_series",
  SET_AUTHOR = "set_author",
}

export interface PostAction extends UnknownAction {
  type: string;
  payload?: NewPost;
}

export const initState: NewPost = {
  title: "",
  thumbnail: "",
  description: "",
  content: "",
  topic: "",
  series: "",
  authorId: "",
};

const postReducer = (state = initState, action: PostAction): NewPost => {
  switch (action.type) {
    case PostActionType.CLEAR:
      return initState;
    case PostActionType.SET_TITLE:
      return { ...state, title: action.payload?.title };
    case PostActionType.SET_CONTENTS:
      return { ...state, content: action.payload?.content };
    case PostActionType.SET_THUMBNAIL:
      return { ...state, thumbnail: action.payload?.thumbnail };
    case PostActionType.SET_DESCRIPTION:
      return { ...state, description: action.payload?.description };
    case PostActionType.SET_TOPIC:
      return { ...state, topic: action.payload?.topic };
    case PostActionType.SET_SERIES:
      return { ...state, series: action.payload?.series };
    case PostActionType.SET_AUTHOR:
      return { ...state, authorId: action.payload?.authorId };
    default:
      return state;
  }
};

export default postReducer;
