import IconProps from "@/lib/types/icon";

const LoginIcon: React.FC<IconProps> = ({ width, height }) => {
  return (
    <svg
      fill="#000000"
      width={width}
      height={height}
      viewBox="-1 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917zm-6.24-.064H6.81a2.528 2.528 0 0 0-2.692 2.303v1.51a.794.794 0 0 0 .792.792h7.166a.794.794 0 0 0 .792-.791V11.82a2.528 2.528 0 0 0-2.692-2.302zM6.14 6.374a2.353 2.353 0 1 0 2.353-2.353A2.353 2.353 0 0 0 6.14 6.374z" />
    </svg>
  );
};

export default LoginIcon;
