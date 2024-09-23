import Link from "next/link";
import prisma from "../prisma";

interface TopicProps {
  topicName?: string;
}

const Topics: React.FC<TopicProps> = async ({ topicName }) => {
  const topics = await prisma.topic.findMany();
  return (
    <div className="topic-container">
      <Link
        className={`topic ${topicName === undefined ? "highlight" : ""}`}
        href={"/"}
      >
        #전체보기
      </Link>
      {topics.map((topic, index) => {
        return (
          <Link
            className={`topic ${topic.name === topicName ? "highlight" : ""}`}
            key={`topic-${index}`}
            href={`/topic/${topic.name}`}
          >
            #{topic.name}
          </Link>
        );
      })}
    </div>
  );
};

export default Topics;
