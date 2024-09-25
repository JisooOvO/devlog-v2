"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "@/style/unauthorized.css";

const UnauthorizedPage = () => {
  const router = useRouter();
  const { status } = useSession();

  if (status === "loading") {
    return <></>;
  }

  if (status === "authenticated") {
    router.back();
    return <></>;
  }

  return (
    <div className="unauthorized-container">
      <p>권한이 없습니다</p>
      <button onClick={() => router.back()}>돌아가기</button>
    </div>
  );
};

export default UnauthorizedPage;
