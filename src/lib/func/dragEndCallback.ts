import { Dispatch, SetStateAction } from "react";

export const MARKDOWNAREA = "markdown-area";

const dragEndCallback = async (
  event: DragEvent,
  setImg: Dispatch<SetStateAction<string>>,
) => {
  event.preventDefault();

  const targetElement = event.target as HTMLElement;

  if (targetElement.id !== MARKDOWNAREA) return;

  const fileList = event.dataTransfer?.files;

  if (fileList && fileList.length > 0) {
    const targetFile = fileList[0];

    if (!targetFile.type.startsWith("image/")) return;

    const formData = new FormData();

    formData.append("image", targetFile);
    formData.append("directory", "images");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const jsonData = await response.json();

    switch (response.status) {
      case 200:
        setImg(jsonData["path"]);
        break;
      default:
        alert(jsonData["message"]);
        break;
    }
  }
};

export default dragEndCallback;
