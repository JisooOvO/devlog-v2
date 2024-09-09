"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogHeader() {
  return (
    <header>
      <Link className="title" href={"/"}>
        {process.env.NEXT_PUBLIC_TITLE}
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
  const [loginState, setLoginState] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    console.log(process.env.NEXT_PUBLIC_USERNAME);
    console.log(process.env.NEXT_PUBLIC_PASSWORD);

    if (username !== process.env.NEXT_PUBLIC_USERNAME) return;
    if (password !== process.env.NEXT_PUBLIC_PASSWORD) return;

    setLoginState(true);
  }, []);

  if (loginState) return <Link href={"write"}>WRITE</Link>;
  else return <></>;
};

// --------------------------------------------------------------------------

const DarkModeButton = () => {
  const toggleDarkMode = () => {
    document.querySelector("body")?.classList.toggle("dark");
  };

  return <button onClick={toggleDarkMode}>DARK</button>;
};
