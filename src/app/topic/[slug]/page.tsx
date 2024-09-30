import NotFoundRouter from "@/lib/components/notFoundRouter";
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
    where: {
      name: {
        not: "",
      },
    },
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
      name: {
        equals: topicName,
        mode: "insensitive",
      },
    },
    include: {
      series: true,
    },
  });

  return (
    <>
      {topic ? (
        <>
          <Topics topicName={topicName} showSeries={true} />
          {topic?.series.map((s, index) => {
            return (
              <Posts
                key={`post-${index}`}
                seriesName={s.name}
                seriesId={s.id}
                showSeries={true}
                take={6}
              />
            );
          })}
        </>
      ) : (
        <NotFoundRouter />
      )}
    </>
  );
};

export default TopicPage;
