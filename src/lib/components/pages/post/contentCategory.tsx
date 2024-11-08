"use client";

import "@/style/content.css";
import IconButton from "@/lib/components/iconButton";
import Link from "next/link";
import RightArrowIcon from "@/lib/icons/rightArrow";
import Content from "@/lib/types/content";

interface Props {
  size: string;
  post: Content;
}

const ContentCategory: React.FC<Props> = ({ size, post }) => {
  return (
    <div className="content-category">
      {post?.topic?.name ? (
        <Link href={`/topic/${post.topic.name.replaceAll(" ", "-")}`}>
          <p>#</p>
          <p>{post.topic.name}</p>
        </Link>
      ) : (
        <p># 주제</p>
      )}

      <IconButton description="">
        <RightArrowIcon width={size} height={size} />
      </IconButton>
      {post?.series?.name ? (
        <Link href={`/series/${post.series.name.replaceAll(" ", "-")}`}>
          <p>#</p>
          <p>{post.series.name}</p>
        </Link>
      ) : (
        <p># 시리즈</p>
      )}
    </div>
  );
};

export default ContentCategory;
