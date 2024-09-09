"use client";

import { useState } from "react";
import MarkdownEditor from "./markdownEditor";

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/write", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert("Post created successfully!");
      setTitle("");
      setContent("");
    } else {
      alert("Failed to create post.");
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
          required
        />
      </div>
      <MarkdownEditor markdown={content} setMarkdown={setContent} />
      <button className="write-button" type="submit">
        SAVE
      </button>
    </form>
  );
};

export default WritePage;
