export default function HomePage() {
  // API 로 분리해야겠음..
  // const directoryPath = path.join(process.cwd(), "src/app");
  // const directories = fs
  //   .readdirSync(directoryPath, { withFileTypes: true })
  //   .filter((dirent) => dirent.isDirectory())
  //   .filter((dirent) => dirent.name !== "api")
  //   .map((dirent) => dirent.name);

  return (
    <>
      <p>메인이올시다</p>
      <div style={{ height: "200vh" }}></div>
    </>
  );
}
