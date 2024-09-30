"use client";

import { notFound, useRouter } from "next/navigation";
import LeftArrowIcon from "../icons/leftArrow";
import RightArrowIcon from "../icons/rightArrow";
import IconButton from "./iconButton";
import { useEffect } from "react";

interface Props {
  page: number | undefined;
  take: number;
  maximum: number;
}

const arrowSize = "1.5rem";

const PostPageButton: React.FC<Props> = ({ page, take, maximum }) => {
  const router = useRouter();
  const pageNumber = page ?? 1;

  return (
    <div className="post-button-container">
      {pageNumber !== 1 ? (
        <IconButton
          description="이전"
          onClick={() => {
            router.push(`?page=${pageNumber - 1}`);
          }}
        >
          <LeftArrowIcon width={arrowSize} height={arrowSize} />
        </IconButton>
      ) : (
        <div style={{ width: arrowSize, height: arrowSize }}></div>
      )}
      <span>{pageNumber}</span>
      {pageNumber * take <= maximum ? (
        <IconButton
          description="다음"
          onClick={() => {
            router.push(`?page=${pageNumber + 1}`);
          }}
        >
          <RightArrowIcon width={arrowSize} height={arrowSize} />
        </IconButton>
      ) : (
        <div style={{ width: arrowSize, height: arrowSize }}></div>
      )}
    </div>
  );
};

export default PostPageButton;
