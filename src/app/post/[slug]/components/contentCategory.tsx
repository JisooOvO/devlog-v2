"use client";

import IconButton from "@/lib/components/iconButton";
import "@/style/content.css";
import "@/style/topic.css";
import Link from "next/link";
import RightArrowIcon from "@/lib/icons/rightArrow";
import { Content } from "@/lib/components/constant/postProps";

interface Props {
  size: string;
  post: Content;
}

const ContentCategory: React.FC<Props> = ({ size, post }) => {
  return (
    <div className="content-category">
      {post?.topic?.name ? (
        <Link className="topic" href={`/topic/${post.topic.name}`}>
          # {post.topic.name}
        </Link>
      ) : (
        <div className="topic"># 주제</div>
      )}

      <IconButton description="">
        <RightArrowIcon width={size} height={size} />
      </IconButton>
      {post?.series?.name ? (
        <Link className="topic" href={`/series/${post.series.name}`}>
          # {post.series.name}
        </Link>
      ) : (
        <div className="topic"># 시리즈</div>
      )}
    </div>
  );
};

export default ContentCategory;
