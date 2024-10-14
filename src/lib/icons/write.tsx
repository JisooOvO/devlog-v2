import IconProps from "@/lib/constants/imageProps";

const WriteIcon: React.FC<IconProps> = ({ width, height }) => {
  return (
    <svg
      fill="#000000"
      width={width}
      height={height}
      viewBox="-1 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.417 9.579A7.917 7.917 0 1 1 8.5 1.662a7.917 7.917 0 0 1 7.917 7.917zM4.63 8.182l2.45-2.449-.966-.966a.794.794 0 0 0-1.12 0l-1.329 1.33a.794.794 0 0 0 0 1.12zm8.23 5.961c.13 0 .206-.1.173-.247l-.573-2.542a1.289 1.289 0 0 0-.292-.532l-4.53-4.53-.634.636 4.529 4.529.252-.252a.793.793 0 0 1 .147.268l.253 1.124-.69.69-1.125-.252a.799.799 0 0 1-.268-.148l.871-.87-4.53-4.53L5.19 8.742l4.53 4.528a1.294 1.294 0 0 0 .533.293l2.542.573a.3.3 0 0 0 .066.008z" />
    </svg>
  );
};

export default WriteIcon;
