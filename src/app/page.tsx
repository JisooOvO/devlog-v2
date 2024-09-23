import Posts from "@/lib/components/posts";
import Topics from "@/lib/components/topics";

export const revalidate = 10;
export const dynamicParams = true;

const HomePage: React.FC = async () => {
  return (
    <>
      <Topics />
      <Posts />
    </>
  );
};

export default HomePage;
