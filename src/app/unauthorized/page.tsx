import "@/style/unauthorized.css";
import BackButton from "./components/backButton";

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <p>권한이 없습니다</p>
      <BackButton />
    </div>
  );
};

export default UnauthorizedPage;
