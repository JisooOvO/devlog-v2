"use client";

import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import IconButton from "@/lib/components/iconButton";
import LoginIcon from "@/lib/icons/login";
import WriteIcon from "@/lib/icons/write";
import "@/style/blogHeader.css";
import SettingIcon from "../../icons/setting";
import checkAuth from "../../utils/functions/checkAuth";
import { useEffect, useState } from "react";

const size = "2rem";

interface NextAuthStatus {
  session?: Session | null;
  status: "unauthenticated" | "authenticated" | "loading";
}

export default function BlogHeader() {
  const { data: session, status } = useSession();

  return (
    <header>
      <Link className="title" href={"/"}>
        <p>Jisoo.</p>
        <p>기술블로그</p>
      </Link>
      <nav>
        <LoginButton session={session} status={status} />
        <ManageButton session={session} status={status} />
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
              <div className="heaeder-user-info">
                <Image
                  src={session?.user?.image}
                  alt="user image"
                  fill
                  sizes="100% 100%"
                />
              </div>
            ) : (
              <></>
            )}
            <p>{session?.user?.name}</p>
          </div>
          <IconButton description="로그아웃" onClick={() => signOut()}>
            <LoginIcon width={size} height={size} />
          </IconButton>
        </>
      );
    case "unauthenticated":
      return (
        <IconButton description="로그인" onClick={() => signIn("github")}>
          <LoginIcon width={size} height={size} />
        </IconButton>
      );
    default:
      return null;
  }
};

// --------------------------------------------------------------------------

const ManageButton: React.FC<NextAuthStatus> = ({ session, status }) => {
  const [element, setElement] = useState<JSX.Element | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authElement = async () => {
      switch (status) {
        case "authenticated":
          if (await checkAuth(session?.user?.email)) {
            setElement(
              <>
                <IconButton
                  description="글 쓰기"
                  onClick={() => router.push("/write")}
                >
                  <WriteIcon width={size} height={size} />
                </IconButton>
                <IconButton
                  description="블로그 관리"
                  onClick={() => router.push("/manage")}
                >
                  <SettingIcon width={size} height={size} />
                </IconButton>
              </>
            );
          }
        default:
          return null;
      }
    };
    authElement();
  }, [session, status, router]);

  return element;
};

// --------------------------------------------------------------------------

// const DarkModeButton = () => {
//   const toggleDarkMode = () => {
//     document.querySelector("body")?.classList.toggle("dark");
//   };

//   return <button onClick={toggleDarkMode}>다크</button>;
// };