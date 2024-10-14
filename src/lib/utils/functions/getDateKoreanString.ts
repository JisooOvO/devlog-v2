const getDateKoreanString = (date: Date | undefined, showTime?: boolean) => {
  if (date === undefined) return "";

  const koDate = date.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour12: false,
    ...(showTime && {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  });

  return koDate;
};

export default getDateKoreanString;
