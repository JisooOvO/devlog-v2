import Posts from "@/lib/components/posts";
import Topics from "@/lib/components/topics";
import isValidPage from "@/lib/utils/functions/isValidPage";

export const revalidate = 60;

interface Props {
  searchParams: { [key: string]: string | undefined };
}

const HomePage: React.FC<Props> = async ({ searchParams }) => {
  const pageParam = searchParams["page"];

  const page = pageParam && isValidPage(pageParam) ? parseInt(pageParam) : 1;

  return (
    <>
      <Topics />
      <Posts showSeries={true} page={page} />
    </>
  );
};

export default HomePage;
