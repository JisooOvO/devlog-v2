"use client";

import { useEffect } from "react";

const ClientScrollProvider = () => {
  useEffect(() => {
    const callback = () => {
      const scrollY = window.scrollY;
      const className = "header-line";
      const header = document.querySelector("header");

      if (scrollY == 0) {
        header?.classList.remove(className);
      } else if (!header?.classList.contains(className)) {
        header?.classList.add(className);
      }
    };

    window.addEventListener("scroll", callback);

    return () => window.removeEventListener("scroll", callback);
  }, []);

  return <></>;
};

export default ClientScrollProvider;
