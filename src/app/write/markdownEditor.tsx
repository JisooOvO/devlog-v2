import {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

let backtickCount = 0;

interface mardownProps {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<string>>;
}

const MarkdownEditor: React.FC<mardownProps> = ({ markdown, setMarkdown }) => {
  const [isWrite, setIsWrite] = useState(false);

  useEffect(() => {
    const dragEndCallback = (event: DragEvent) => {
      event.preventDefault();

      const fileList = event.dataTransfer?.files;

      if (fileList && fileList.length > 0) {
        const file = fileList[0];

        if (file.type.startsWith("image/")) {
          // TODO : 이미지 저장 로직 만들기
        }
      }
    };

    const handleDrop = (event: Event) => dragEndCallback(event as DragEvent);

    const app = document.querySelector(".App");

    if (app) {
      app.addEventListener("drop", handleDrop);
      app.addEventListener("dragover", handleDrop);
    }

    return () => {
      if (app) {
        app.removeEventListener("drop", handleDrop);
        app.removeEventListener("dragover", handleDrop);
      }
    };
  }, []);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    const textarea = event.target as HTMLTextAreaElement;

    switch (event.key) {
      case "Tab":
        if (isWrite) event.preventDefault();
        break;
      case "`":
        backtickCount++;
        if (backtickCount === 3) {
          event.preventDefault();
          const JAVASCRIPT = "javascript";
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const value = textarea.value;

          textarea.value =
            value.substring(0, start) +
            `\`${JAVASCRIPT}\n\n\`\`\`` +
            value.substring(end);

          textarea.selectionStart = textarea.selectionEnd =
            start + JAVASCRIPT.length + 2;
          backtickCount = 0;
        }
        break;
      default:
        backtickCount = 0;
    }
  };

  const handleKeyUp: KeyboardEventHandler = (event) => {
    const textarea = event.target as HTMLTextAreaElement;

    if (isWrite && event.code === "Tab") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      if (event.shiftKey) {
        // TODO : 쉬프트 탭 기능 구현
      } else {
        //  뭔가 버그가 있음..
        textarea.value =
          value.substring(0, start) + "  " + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }
    }

    setMarkdown(textarea.value);
  };

  return (
    <div className="markdown">
      <textarea
        spellCheck={false}
        onFocus={() => setIsWrite(true)}
        onBlur={() => setIsWrite(false)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="여기에 마크다운을 입력하세요..."
      />
      <div className="preview">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          children={markdown}
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
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;