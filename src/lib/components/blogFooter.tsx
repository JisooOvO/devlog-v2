import "@/style/blogFooter.css";
import GithubIcon from "../icons/github";
import MailIcon from "../icons/mail";
import Image from "next/image";
import IconButton from "./iconButton";
import { PLACEHOLDER } from "./constant/imageProps";

const size = "2rem";

const BlogFooter: React.FC = () => {
  return (
    <div className="blog-footer-container">
      <div className="blog-footer-content">
        <div className="blog-footer-image">
          <Image
            src={"/profile/profile.jpeg"}
            alt="프로필"
            fill
            sizes="100%, 100%"
            placeholder="blur"
            blurDataURL={PLACEHOLDER}
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
      </div>
    </div>
  );
};

export default BlogFooter;
