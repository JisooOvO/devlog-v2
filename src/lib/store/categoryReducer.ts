import { UnknownAction } from "@reduxjs/toolkit";

export enum categoryActionType {
  SET = "SET",
  GET = "GET",
}

export interface categoryAction extends UnknownAction {
  type: string;
  payload: string[];
}

const initState: string[] = [];

const categoryReducer = (
  state = initState,
  action: categoryAction
): string[] => {
  switch (action.type) {
    case categoryActionType.SET:
      return action.payload;
    case categoryActionType.GET:
      return state;
    default:
      return state;
  }
};

export default categoryReducer;
