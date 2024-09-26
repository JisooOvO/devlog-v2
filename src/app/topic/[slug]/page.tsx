import Posts from "@/lib/components/posts";
import Topics from "@/lib/components/topics";
import prisma from "@/lib/prisma";

interface TopicProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const topics = await prisma.topic.findMany({
    select: {
      name: true,
    },
  });

  return topics.map((topic) => ({
    slug: topic.name.replace(/\s+/g, "-"),
  }));
}

const TopicPage: React.FC<TopicProps> = async ({ params }) => {
  const topicName = decodeURIComponent(params.slug.replace(/-/g, " "));

  const topic = await prisma.topic.findFirst({
    where: {
      name: topicName,
    },
    include: {
      series: true,
    },
  });

  return (
    <>
      <Topics topicName={topicName} />
      {topic?.series.map((s, index) => {
        return (
          <Posts
            key={`post-${index}`}
            seriesName={s.name}
            seriesId={s.id}
            showSeries={true}
          />
        );
      })}
    </>
  );
};

export default TopicPage;
