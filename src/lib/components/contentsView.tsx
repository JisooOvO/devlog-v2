import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import Image from "next/image";
import "@/style/content.css";
import getDateKoreanString from "@/lib/func/getDateKoreanString";
import { PLACEHOLDER } from "@/lib/constant/imageProps";
import ContentCategory from "@/app/post/[slug]/components/contentCategory";
import LikeContainer from "@/lib//components/likeContainer";
import { Content } from "@/lib/constant/postProps";

interface Props {
  post: Content;
}

const size = "1.5rem";

const ContentsView: React.FC<Props> = ({ post }) => {
  if (post === null) {
    return notFound();
  }

  return (
    <div>
      <h1>{post.title?.length !== 0 ? post.title : "제목"}</h1>
      <hr />
      <div className="content-meta">
        <div className="content-author-updated">
          {post.author?.name?.length !== 0}
          <div className="content-author">
            <Image
              src={post.author?.image ? post.author.image : PLACEHOLDER}
              alt={`글쓴이`}
              width={100}
              height={100}
            />
            <p>{post.author?.name ? post.author.name : "저자"}</p>
          </div>
          {post.updatedAt ? (
            <p className="content-updated-at">
              {getDateKoreanString(post.updatedAt!, true)}
            </p>
          ) : null}
        </div>
        <LikeContainer size={size} post={post} />
      </div>
      <ContentCategory size={size} post={post} />
      {post.thumbnail?.path ? (
        <div className="content-thumbnail">
          <Image
            src={post.thumbnail.path}
            alt="썸네일"
            fill
            sizes="100%,20rem"
            placeholder="blur"
            blurDataURL={PLACEHOLDER}
          />
        </div>
      ) : null}
      <div className="content-main">
        <MarkdownRender post={post} />
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------

const MarkdownRender: React.FC<Props> = ({ post }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              customStyle={{ borderRadius: "10px" }}
              showLineNumbers
              PreTag="div"
              language={match[1]}
              wrapLines
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={`inline-code ${className}`} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {post!.content}
    </ReactMarkdown>
  );
};

export default ContentsView;
