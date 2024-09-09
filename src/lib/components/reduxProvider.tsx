"use client";

import { Provider } from "react-redux";
import store from "../store";
import BlogHeader from "./blogHeader";
import ClientCategoryMaker from "./client/clientCategoryMaker";
import ClientScrollMaker from "./client/clientScrollMaker";

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
