import Link from "next/link";

export default async function HomePage() {
  return (
    <>
      <Link href={"post"}>POST</Link>
      <Link href={"write"}>WRITE</Link>
    </>
  );
}
