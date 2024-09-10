"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogHeader() {
  return (
    <header>
      <Link className="title" href={"/"}>
        기술블로그
      </Link>
      <nav>
        <WriteButton />
        <DarkModeButton />
      </nav>
    </header>
  );
}

// --------------------------------------------------------------------------

const WriteButton = () => {
  return <Link href={"/write"}>WRITE</Link>;
};

// --------------------------------------------------------------------------

const DarkModeButton = () => {
  const toggleDarkMode = () => {
    document.querySelector("body")?.classList.toggle("dark");
  };

  return <button onClick={toggleDarkMode}>DARK</button>;
};
