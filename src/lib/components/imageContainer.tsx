import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { PLACEHOLDER } from "../utils/constants/imageProps";

interface Props {
  width: string;
  height: string;
  src?: string | StaticImport | null;
  alt: string;
}

const ImageContainer: React.FC<Props> = ({ width, height, src, alt }) => {
  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={src ?? PLACEHOLDER}
        alt={alt}
        fill
        sizes="100% 100%"
        placeholder="blur"
        blurDataURL={PLACEHOLDER}
      />
    </div>
  );
};

export default ImageContainer;
