"use client";

import { Provider } from "react-redux";
import store from "../store";
import BlogHeader from "./blogHeader";
import ClientCategoryMaker from "./client/clientCategoryMaker";
import ClientScrollMaker from "./client/clientScrollMaker";
import { RootLayoutProps } from "@/app/layout";

const ReduxProvider = ({ children }: RootLayoutProps) => {
  return (
    <Provider store={store}>
      <ClientCategoryMaker />
      <ClientScrollMaker />
      <BlogHeader />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
