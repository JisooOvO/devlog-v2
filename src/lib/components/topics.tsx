import Link from "next/link";
import prisma from "../prisma";
import "@/style/topic.css";
import { Topic } from "@prisma/client";
import { Fragment } from "react";

interface TopicProps {
  topicName?: string;
  topics?: (Topic & {
    series: { name: string }[];
  })[];
  seriesName?: string;
  showSeries?: boolean;
}

const Topics: React.FC<TopicProps> = async ({
  topicName,
  seriesName,
  showSeries,
}) => {
  const topics: (Topic & {
    series: { name: string }[];
  })[] = await prisma.topic.findMany({
    where: {
      name: {
        not: "",
      },
    },
    include: {
      series: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="topic-layout">
      <TopicContainer topicName={topicName} topics={topics} />
      {showSeries ? (
        <SeriesContainer
          topicName={topicName}
          seriesName={seriesName}
          topics={topics}
        />
      ) : null}
    </div>
  );
};

// --------------------------------------------------------------------------

const TopicContainer: React.FC<TopicProps> = ({ topicName, topics }) => {
  return (
    <div className="topic-container">
      <Link
        className={`topic ${topicName === undefined ? "highlight" : ""}`}
        href={"/"}
      >
        전체
      </Link>
      {topics?.map((topic, index) => {
        return (
          <Link
            className={`topic ${topicName === topic.name ? "highlight" : ""}`}
            key={`topic-${index}`}
            href={`/topic/${topic.name.replaceAll(" ", "-")}`}
          >
            {topic.name}
          </Link>
        );
      })}
    </div>
  );
};

// --------------------------------------------------------------------------

const size = "1.5rem";

const SeriesContainer: React.FC<TopicProps> = ({
  topicName,
  seriesName,
  topics,
}) => {
  return (
    <div className="series-container">
      <div className="series-list">
        {topics?.map((topic, index) => {
          if (topic.name === topicName) {
            return topic.series.map((s, i) => {
              return (
                <Link
                  className={`series ${
                    seriesName === s.name ? "series-highlight" : ""
                  }`}
                  key={`series-${i}`}
                  href={`/series/${s.name.replaceAll(" ", "-")}`}
                >
                  <p># {s.name}</p>
                </Link>
              );
            });
          } else {
            return <Fragment key={index}></Fragment>;
          }
        })}
      </div>
    </div>
  );
};

export default Topics;
