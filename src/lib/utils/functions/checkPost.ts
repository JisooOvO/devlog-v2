import Content from "@/lib/types/content";

const checkPost = (post: Content): [string, boolean] => {
  for (const key in post) {
    const data = post[key as keyof Content];

    switch (key) {
      case "title":
        if (data === "") {
          return ["제목은", false];
        }
      case "content":
        if (data === "") {
          return ["내용은", false];
        }
      case "description":
        if (data === "") {
          return ["소개는", false];
        }
      case "topic":
        if (data["name"] === "") {
          return ["주제는", false];
        }
      case "series":
        if (data["name"] === "") {
          return ["시리즈는", false];
        }
    }
  }
  return ["", true];
};

export default checkPost;
