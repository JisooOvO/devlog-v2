"use client";

import { Provider } from "react-redux";
import store from "../../store";
import BlogHeader from "../blogHeader";
import ClientCategoryProvider from "./clientCategoryProvider";
import ClientScrollProvider from "./clientScrollProvider";
import { RootLayoutProps } from "@/app/layout";
import { SessionProvider } from "next-auth/react";

const ClientProvider = ({ children }: RootLayoutProps) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ClientCategoryProvider />
        <ClientScrollProvider />
        <BlogHeader />
        <div className="contents">{children}</div>
      </Provider>
    </SessionProvider>
  );
};

export default ClientProvider;
