import IconProps from "@/lib/types/icon";

const CcIcon: React.FC<IconProps> = ({ width, height }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="-10 70 1034 1034"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
    >
      <path
        fill="#000000"
        d="M499 226q-166 0 -280 117q-58 58 -88.5 131t-30.5 152.5t30 152t87.5 130t130 87.5t152 30t153.5 -30.5t133 -88.5q56 -55 85 -127t29 -153.5t-29.5 -154t-85.5 -128.5q-118 -118 -286 -118zM501 299q135 0 232 96q46 47 70.5 106t24.5 125q0 138 -94 230
q-48 47 -108.5 72t-125 25t-124 -24.5t-106.5 -71.5t-72.5 -106.5t-25.5 -124.5t25.5 -124.5t72.5 -107.5q94 -95 231 -95zM389 502q-50 0 -83.5 33.5t-33.5 91.5t33 91t86 33q34 0 62 -17t43 -46l-49 -25q-14 34 -49 34q-27 0 -40.5 -19t-13.5 -52q0 -70 54 -70
q11 0 23.5 7t20.5 25l54 -28q-32 -58 -107 -58zM621 502q-51 0 -84 33.5t-33 91.5t32.5 91t86.5 33q33 0 60.5 -17t44.5 -46l-50 -25q-14 34 -49 34q-27 0 -40.5 -19t-13.5 -52q0 -70 54 -70q11 0 23.5 7t21.5 25l52 -28q-31 -58 -105 -58z"
      />
    </svg>
  );
};

export default CcIcon;
