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
  });
  return (
    <>
      <Topics topicName={topicName} />
      <Posts topicId={topic?.id} />
    </>
  );
};

export default TopicPage;
