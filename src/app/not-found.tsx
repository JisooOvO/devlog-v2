import BackButton from "./unauthorized/components/backButton";
import "@/style/unauthorized.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 | Page Not Found</h1>
      <p>요청하신 페이지를 찾을 수 없습니다</p>
      <BackButton flag={false} />
    </div>
  );
};

export default NotFound;
