import Posts from "@/lib/components/posts";
import Topics from "@/lib/components/topics";

export const revalidate = 10;
export const dynamicParams = true;

interface Props {
  searchParams: { [key: string]: string | undefined };
}

const HomePage: React.FC<Props> = async ({ searchParams }) => {
  const pageParam = searchParams["page"];

  const isValidPage = (param: string | undefined): boolean => {
    return !isNaN(Number(param)) && Number(param) > 0;
  };

  const page = pageParam && isValidPage(pageParam) ? parseInt(pageParam) : 1;

  return (
    <>
      <Topics />
      <Posts showSeries={true} page={page} />
    </>
  );
};

export default HomePage;
