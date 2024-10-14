"use client";

import checkAuth from "@/lib/functions/checkAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  flag?: boolean;
}

const BackButton: React.FC<Props> = ({ flag = true }) => {
  const router = useRouter();
  const { data } = useSession();

  useEffect(() => {
    const checkUser = async () => {
      if (data?.user) {
        if (await checkAuth(data.user?.email)) {
          router.back();
        }
      }
    };
    if (flag) checkUser();
  }, [data?.user, router, flag]);

  return (
    <button className="back-button" onClick={() => router.back()}>
      돌아가기
    </button>
  );
};

export default BackButton;
