"use client";

import { KeyboardEventHandler, useState } from "react";
import MarkdownEditor from "./markdownEditor";
import { useRouter } from "next/navigation";

const WritePage = () => {
  const router = useRouter();

  const [isWrite, setIsWrite] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/write", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (response.ok) {
      const textarea = document.querySelector("textarea");

      if (textarea) {
        textarea.value = "";
      }

      setTitle("");
      setContent("");

      alert("Post created successfully!");

      router.push("/");
    } else {
      alert("Failed to create post.");
    }
  };

  const handleKeydown: KeyboardEventHandler = (event) => {
    if (event.code === "Tab") {
      setIsWrite(false);
    }
  };

  return (
    <form className="write-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title"></label>
        <input
          type="text"
          className="write-title"
          value={title}
          placeholder="제목"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeydown}
          pattern="[a-zA-Z0-9ㄱ-ㅣ가-힣\s,.?!@#$%^&\(\)\{\}\[\]]{5,30}$"
          required
        />
      </div>
      <MarkdownEditor
        isWrite={isWrite}
        setIsWrite={setIsWrite}
        markdown={content}
        setMarkdown={setContent}
      />
      <button className="write-button" type="submit">
        SAVE
      </button>
    </form>
  );
};

export default WritePage;
