import IconProps from "@/lib/types/icon";

const StarIcon: React.FC<IconProps> = ({ width, height, fill }) => {
  return (
    <svg
      fill={fill ? fill : "#000000"}
      width={width}
      height={height}
      viewBox="-1 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m12.673 10.779.798 4.02c.221 1.11-.407 1.566-1.395 1.013L8.5 13.81l-3.576 2.002c-.988.553-1.616.097-1.395-1.013l.397-2.001.401-2.02-1.51-1.397-1.498-1.385c-.832-.769-.592-1.507.532-1.64l2.026-.24 2.044-.242 1.717-3.722c.474-1.028 1.25-1.028 1.724 0l1.717 3.722 2.044.242 2.026.24c1.124.133 1.364.871.533 1.64L14.184 9.38z" />
    </svg>
  );
};

export default StarIcon;
