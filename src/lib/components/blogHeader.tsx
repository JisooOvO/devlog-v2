"use client";

import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import HighLightButton from "./highlightButton";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NextAuthStatus {
  session?: Session | null;
  status: "unauthenticated" | "authenticated" | "loading";
}

export default function BlogHeader() {
  const { data: session, status } = useSession();

  return (
    <header>
      <Link className="title" href={"/"}>
        기술블로그
      </Link>
      <nav>
        <LoginButton session={session} status={status} />
        <WriteButton status={status} />
        {/* <DarkModeButton /> */}
      </nav>
    </header>
  );
}

// --------------------------------------------------------------------------

const LoginButton: React.FC<NextAuthStatus> = ({ session, status }) => {
  switch (status) {
    case "authenticated":
      return (
        <>
          <div className="header-user-container">
            {session?.user?.image ? (
              <Image
                src={session?.user?.image}
                alt="user image"
                width={200}
                height={200}
              />
            ) : (
              <></>
            )}
            <p>{session?.user?.name}</p>
          </div>
          <HighLightButton onClick={() => signOut()} title="LOGOUT" />
        </>
      );
    case "unauthenticated":
      return <HighLightButton onClick={() => signIn("github")} title="LOGIN" />;
    default:
      return <></>;
  }
};

// --------------------------------------------------------------------------

const WriteButton: React.FC<NextAuthStatus> = ({ status }) => {
  const router = useRouter();
  switch (status) {
    case "authenticated":
      return (
        <HighLightButton onClick={() => router.push("/write")} title="WRITE" />
      );
    default:
      return <></>;
  }
};

// --------------------------------------------------------------------------

const DarkModeButton = () => {
  const toggleDarkMode = () => {
    document.querySelector("body")?.classList.toggle("dark");
  };

  return <HighLightButton onClick={toggleDarkMode} title="DARK" />;
};
