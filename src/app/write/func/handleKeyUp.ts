import { Dispatch, KeyboardEvent, SetStateAction } from "react";

const handleKeyUp = (
  event: KeyboardEvent<HTMLTextAreaElement>,
  isWrite: boolean,
  setIsWrite: Dispatch<SetStateAction<boolean>>,
) => {
  const textarea = event.target as HTMLTextAreaElement;

  setIsWrite(true);

  if (isWrite && event.code === "Tab") {
    event.preventDefault();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(end);

    switch (event.shiftKey) {
      case true:
        textarea.value = beforeCursor.replace(/\t([^]*)$/, "$1") + afterCursor;
        textarea.selectionStart = textarea.selectionEnd = start - 1;
        break;
      case false:
        textarea.value = beforeCursor + "\t" + afterCursor;
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        break;
    }
  }
};

export default handleKeyUp;
