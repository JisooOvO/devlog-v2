import { UnknownAction } from "@reduxjs/toolkit";

export enum categoryActionType {
  SET = "SET",
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
    default:
      return state;
  }
};

export default categoryReducer;
