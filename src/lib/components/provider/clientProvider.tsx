"use client";

import { Provider } from "react-redux";
import store from "../../utils/store";
import BlogHeader from "../layouts/blogHeader";
import ClientScrollProvider from "./clientScrollProvider";
import { RootLayoutProps } from "@/app/layout";
import { SessionProvider } from "next-auth/react";
import BlogFooter from "../layouts/blogFooter";

const ClientProvider = ({ children }: RootLayoutProps) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ClientScrollProvider />
        <BlogHeader />
        <div className="contents">{children}</div>
        <div>
          <hr />
        </div>
        <BlogFooter />
      </Provider>
    </SessionProvider>
  );
};

export default ClientProvider;
