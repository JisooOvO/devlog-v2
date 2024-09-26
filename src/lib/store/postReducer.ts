import { UnknownAction } from "@reduxjs/toolkit";
import { Content } from "@/lib/constant/postProps";

export enum PostActionType {
  CLEAR = "clear",
  SET_POST = "set",
  SET_TITLE = "set_title",
  SET_CONTENTS = "set_contents",
  SET_THUMBNAIL = "set_thumbnail",
  SET_DESCRIPTION = "set_description",
  SET_PUBLISHED = "set_published",
  SET_TOPIC = "set_topic",
  SET_SERIES = "set_series",
  SET_AUTHOR = "set_author",
}

export interface PostAction extends UnknownAction {
  type: string;
  payload?: Content;
}

export const initState: Content = {
  title: "",
  content: "",
  description: "",
  published: false,
  thumbnail: {
    path: "",
  },
  topic: {
    name: "",
  },
  series: {
    name: "",
  },
  author: {
    name: "",
    email: "",
    image: "",
  },
};

const postReducer = (state = initState, action: PostAction): Content => {
  switch (action.type) {
    case PostActionType.CLEAR:
      return { ...initState };
    case PostActionType.SET_POST:
      return { ...action.payload };
    case PostActionType.SET_TITLE:
      return { ...state, title: action.payload?.title };
    case PostActionType.SET_CONTENTS:
      return { ...state, content: action.payload?.content };
    case PostActionType.SET_THUMBNAIL:
      return { ...state, thumbnail: action.payload?.thumbnail };
    case PostActionType.SET_DESCRIPTION:
      return { ...state, description: action.payload?.description };
    case PostActionType.SET_PUBLISHED:
      return { ...state, published: action.payload?.published };
    case PostActionType.SET_TOPIC:
      return { ...state, topic: action.payload?.topic };
    case PostActionType.SET_SERIES:
      return { ...state, series: action.payload?.series };
    case PostActionType.SET_AUTHOR:
      return { ...state, author: action.payload?.author };
    default:
      return state;
  }
};

export default postReducer;
