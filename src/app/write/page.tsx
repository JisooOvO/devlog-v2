"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleContentChange = (value?: string) => {
    setContent(value || "");
  };

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
    <div>
      <h1>Write a New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <MDEditor
            value={content}
            onChange={handleContentChange}
            preview="edit"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default WritePage;
