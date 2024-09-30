import IconProps from "../constant/imageProps";

const DownRightArrowIcon: React.FC<IconProps> = ({ width, height }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 16H11L16 11L11 6H10V10H4V1H2V12H10V16Z" fill="#000000" />
    </svg>
  );
};

export default DownRightArrowIcon;
