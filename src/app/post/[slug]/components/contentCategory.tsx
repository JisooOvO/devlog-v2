"use client";

import IconButton from "@/lib/components/iconButton";
import "@/style/content.css";
import Link from "next/link";
import RightArrowIcon from "@/lib/icons/rightArrow";
import { Content } from "@/lib/constant/postProps";

interface Props {
  size: string;
  post: Content;
}

const ContentCategory: React.FC<Props> = ({ size, post }) => {
  return (
    <div className="content-category">
      {post?.topic?.name ? (
        <Link href={`/topic/${post.topic.name}`}># {post.topic.name}</Link>
      ) : (
        <p># 주제</p>
      )}

      <IconButton description="">
        <RightArrowIcon width={size} height={size} />
      </IconButton>
      {post?.series?.name ? (
        <Link href={`/series/${post.series.name}`}># {post.series.name}</Link>
      ) : (
        <p># 시리즈</p>
      )}
    </div>
  );
};

export default ContentCategory;
