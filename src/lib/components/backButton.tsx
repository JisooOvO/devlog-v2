"use client";

import checkAuth from "@/lib/utils/functions/checkAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  isCheckUser?: boolean;
}

const BackButton: React.FC<Props> = ({ isCheckUser = true }) => {
  const router = useRouter();
  const { data } = useSession();

  useEffect(() => {
    const checkUser = async () => {
      if (await checkAuth(data?.user?.email)) {
        router.back();
      }
    };
    if (isCheckUser) checkUser();
  }, [data?.user, router, isCheckUser]);

  return (
    <button className="back-button" onClick={() => router.back()}>
      돌아가기
    </button>
  );
};

export default BackButton;
