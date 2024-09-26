"use client";

import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import IconButton from "@/lib/components/iconButton";
import LoginIcon from "@/lib/icons/login";
import WriteIcon from "@/lib/icons/write";
import "@/style/blogHeader.css";
import SettingIcon from "../icons/setting";

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
        기술블로그
      </Link>
      <nav>
        <LoginButton session={session} status={status} />
        <ManageButton status={status} />
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
          {/* <div className="header-user-container">
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
          </div> */}
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

const ManageButton: React.FC<NextAuthStatus> = ({ status }) => {
  const router = useRouter();
  switch (status) {
    case "authenticated":
      // TODO : 인증된 사용자만 볼 수 있게
      return (
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
    default:
      return null;
  }
};

// --------------------------------------------------------------------------

// const DarkModeButton = () => {
//   const toggleDarkMode = () => {
//     document.querySelector("body")?.classList.toggle("dark");
//   };

//   return <HighLightButton onClick={toggleDarkMode} title="DARK" />;
// };
