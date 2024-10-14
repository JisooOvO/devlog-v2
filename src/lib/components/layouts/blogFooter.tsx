import "@/style/blogFooter.css";
import GithubIcon from "../../icons/github";
import MailIcon from "../../icons/mail";
import IconButton from "../iconButton";
import CcIcon from "../../icons/cc";
import ImageContainer from "../imageContainer";

const size = "2rem";

const BlogFooter: React.FC = () => {
  return (
    <div className="blog-footer-container">
      <div className="blog-footer-content">
        <div className="blog-footer-image">
          <ImageContainer
            width="8rem"
            height="8rem"
            src={"/profile/profile.jpeg"}
            alt="프로필"
          />
        </div>
        <div className="blog-footer-description">
          <p>남지수</p>
          <div className="blog-footer-icons">
            <IconButton
              description="깃허브 이동"
              href="https://github.com/jisooovo"
            >
              <GithubIcon width={size} height={size} />
            </IconButton>
            <IconButton
              description="메일 쓰기"
              href="mailto:fdking1887@naver.com"
            >
              <MailIcon width={size} height={size} />
            </IconButton>
          </div>
        </div>
        <div className="blog-footer-cc">
          <IconButton>
            <CcIcon width={"1.5rem"} height={"1.5rem"}></CcIcon>
          </IconButton>
          <p>{new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default BlogFooter;
