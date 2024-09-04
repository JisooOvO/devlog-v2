"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function BlogHeader() {
  return (
    <header>
      <Link className="title" href={"/"}>
        {process.env.NEXT_PUBLIC_TITLE}
      </Link>
      <NavConatiner />
      <DarkModeButton />
    </header>
  );
}

// --------------------------------------------------------------------------

const NavConatiner = () => {
  const categoryState = useSelector((state: RootState) => state.category);

  const categoryList = categoryState.map((category, index) => {
    return (
      <Link key={`category-${index}`} href={`${category}`}>
        {category.toLocaleUpperCase()}
      </Link>
    );
  });

  return <nav>{categoryList}</nav>;
};

// --------------------------------------------------------------------------

const DarkModeButton = () => {
  const toggleDarkMode = () => {
    document.querySelector("body")?.classList.toggle("dark");
  };

  return <button onClick={toggleDarkMode}>DARK</button>;
};
