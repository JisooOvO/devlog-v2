import { KeyboardEvent } from "react";

let backtickCount = 0;

const handleKeyDown = (
  event: KeyboardEvent<HTMLTextAreaElement>,
  isWrite: boolean,
) => {
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

export default handleKeyDown;
