import "@/style/content.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { notFound } from "next/navigation";
import { Content } from "@/lib/constant/postProps";
import { PLACEHOLDER } from "@/lib/constant/imageProps";
import ContentCategory from "@/lib/components/pages/post/contentCategory";
import LikeContainer from "@/lib//components/likeContainer";
import getDateKoreanString from "@/lib/func/getDateKoreanString";

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
            sizes="100%,100%"
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
      rehypePlugins={[
        rehypeRaw,
        [
          rehypeSanitize,
          {
            tagNames: [
              "div",
              "span",
              "p",
              "h1",
              "h2",
              "h3",
              "ul",
              "ol",
              "li",
              "a",
              "strong",
              "em",
              "br",
              "img",
              "table",
              "thead",
              "tbody",
              "th",
              "tr",
              "td",
              "pre",
              "code",
              "blockquote",
              "hr",
              "del",
            ],
          },
        ],
      ]}
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
            <code className={`inline-code`} {...props}>
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
