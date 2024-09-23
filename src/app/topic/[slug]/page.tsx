import Posts from "@/lib/components/posts";
import Topics from "@/lib/components/topics";
import prisma from "@/lib/prisma";

interface TopicProps {
  params: {
    slug: string;
  };
}

const TopicPage: React.FC<TopicProps> = async ({ params }) => {
  const topicName = decodeURIComponent(params.slug);
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
          <Posts key={`post-${index}`} seriesName={s.name} seriesId={s.id} />
        );
      })}
    </>
  );
};

export default TopicPage;
