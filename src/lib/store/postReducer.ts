import { UnknownAction } from "@reduxjs/toolkit";

export interface NewPost {
  title?: string;
  thumbnail?: string | ArrayBuffer | null | undefined;
  description?: string;
  content?: string;
}

export enum PostActionType {
  CLEAR = "clear",
  SET_TITLE = "set_title",
  SET_CONTENTS = "set_contents",
  SET_THUMBNAIL = "set_thumbnail",
  SET_DESCRIPTION = "set_description",
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
    default:
      return state;
  }
};

export default postReducer;
