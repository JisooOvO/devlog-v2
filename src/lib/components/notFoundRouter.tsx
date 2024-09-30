"use client";

import { notFound } from "next/navigation";
import { useEffect } from "react";

const NotFoundRouter = () => {
  useEffect(() => {
    notFound();
  });
  return <div></div>;
};

export default NotFoundRouter;
