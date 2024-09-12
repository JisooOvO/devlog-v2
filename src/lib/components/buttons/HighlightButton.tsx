import { MouseEventHandler } from "react";

interface ButtonProps {
  title: string;
  onClick: MouseEventHandler;
}

const HighLightButton: React.FC<ButtonProps> = ({ onClick, title }) => {
  return (
    <button className="highlight-button" onClick={onClick}>
      {title}
    </button>
  );
};

export default HighLightButton;
