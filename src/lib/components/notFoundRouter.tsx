"use client";

import { notFound } from "next/navigation";
import { useEffect } from "react";

const NotFoundRouter = () => {
  useEffect(() => {
    notFound();
  });
  return null;
};

export default NotFoundRouter;
