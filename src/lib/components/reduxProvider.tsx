"use client";

import { Provider } from "react-redux";
import store from "../store";
import BlogHeader from "./blogHeader";
import ClientCategoryMaker from "./clientCategoryMaker";
import ClientScrollMaker from "./clientScrollMaker";

type Props = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <ClientCategoryMaker />
      <ClientScrollMaker />
      <BlogHeader />
      <div className="contents">{children}</div>
    </Provider>
  );
}
