const getDateKoreanString = (date: Date | undefined, showTime?: boolean) => {
  if (date === undefined) return "";

  let result = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일`;

  if (showTime) {
    result += ` ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초`;
  }

  return result;
};

export default getDateKoreanString;
