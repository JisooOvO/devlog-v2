import { UnknownAction } from "@reduxjs/toolkit";

export interface NewPost {
  title?: string;
  description?: string;
  content?: string;
}

export enum PostActionType {
  CLEAR = "clear",
  SET_TITLE = "set_title",
  SET_CONTENTS = "set_contents",
}

export interface PostAction extends UnknownAction {
  type: string;
  payload?: NewPost;
}

const initState: NewPost = {
  title: "",
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
    default:
      return state;
  }
};

export default postReducer;
