import { Post } from "@prisma/client";
import { NewPost } from "../store/postReducer";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

interface Props {
  post: Post | NewPost;
}

const ContentsView: React.FC<Props> = ({ post }) => {
  return (
    <>
      <h1>{post.title}</h1>
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
        {post.content}
      </ReactMarkdown>
    </>
  );
};

export default ContentsView;
