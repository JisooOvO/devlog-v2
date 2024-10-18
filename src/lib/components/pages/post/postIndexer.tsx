"use client";

import { useEffect, useState } from "react";
import IconButton from "../../iconButton";
import DeleteIcon from "@/lib/icons/delete";

const PostIndexer: React.FC = () => {
  const [content, setContent] = useState<Array<JSX.Element>>([]);

  useEffect(() => {
    const contentMainChildNodes =
      document.querySelector(".content-main")?.childNodes;

    contentMainChildNodes?.forEach((child, index) => {
      if (/^H[2-6]$/.test(child.nodeName)) {
        setContent((prev) => {
          return [
            ...prev,
            <button
              key={`index${index}`}
              onClick={(e) => {
                e.preventDefault();

                console.log((child as Element).getBoundingClientRect());
                window.scrollTo({
                  top:
                    (child as Element).getBoundingClientRect().top +
                    window.scrollY -
                    16 * 6,
                });
              }}
              className={`post-indexer-${child.nodeName.toLocaleLowerCase()}`}
            >
              {child.textContent}
            </button>,
          ];
        });
      }
    });

    return () => {
      setContent(() => []);
    };
  }, []);

  return (
    <div className="post-indexer-layout relative">
      <div className="post-indexer-container">{content.map((e) => e)}</div>
      <div className="post-indexer-toggle">
        <IconButton
          onClick={() => {
            document
              .querySelector(".post-indexer-container")
              ?.classList.toggle("hidden");
          }}
        >
          <DeleteIcon width="2rem" height="2rem" />
        </IconButton>
      </div>
    </div>
  );
};

export default PostIndexer;
