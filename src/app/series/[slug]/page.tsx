import NotFoundRouter from "@/lib/components/notFoundRouter";
import Posts from "@/lib/components/posts";
import Topics from "@/lib/components/topics";
import prisma from "@/lib/utils/prisma";

interface SeriesProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | undefined };
}

export async function generateStaticParams() {
  const series = await prisma.series.findMany({
    where: {
      name: {
        not: "",
      },
    },
    select: {
      name: true,
    },
  });

  return series.map((s) => ({
    slug: s.name.replace(/\s+/g, "-"),
  }));
}

const SeriesPage: React.FC<SeriesProps> = async ({ params, searchParams }) => {
  const seriesName = decodeURIComponent(params.slug.replace(/-/g, " "));

  const pageParam = searchParams["page"];

  const isValidPage = (param: string | undefined): boolean => {
    return !isNaN(Number(param)) && Number(param) > 0;
  };

  const page = pageParam && isValidPage(pageParam) ? parseInt(pageParam) : 1;

  const series = await prisma.series.findFirst({
    where: {
      name: {
        equals: seriesName,
        mode: "insensitive",
      },
    },
    include: {
      topic: true,
      posts: true,
    },
  });

  return (
    <>
      {series ? (
        <>
          <Topics
            topicName={series.topic.name}
            seriesName={seriesName}
            showSeries={true}
          />
          <Posts
            showSeries={true}
            seriesName={seriesName}
            seriesId={series.id}
            page={page}
          />
        </>
      ) : (
        <NotFoundRouter />
      )}
    </>
  );
};

export default SeriesPage;
