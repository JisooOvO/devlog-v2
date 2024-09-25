import IconProps from "../components/constant/imageProps";

const UpArrowIcon: React.FC<IconProps> = ({ width, height }) => {
  return (
    <svg
      fill="#000000"
      width={width}
      height={height}
      viewBox="-1 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.416 9.579A7.917 7.917 0 1 1 8.5 1.662a7.917 7.917 0 0 1 7.916 7.917zm-4.07-1.64L9.06 4.652a.792.792 0 0 0-1.12 0L4.653 7.94a.792.792 0 1 0 1.12 1.12l1.935-1.936v6.833a.792.792 0 1 0 1.583 0V7.123l1.936 1.936a.792.792 0 1 0 1.12-1.12z" />
    </svg>
  );
};

export default UpArrowIcon;
