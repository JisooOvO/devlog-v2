const isValidPage = (param: string | undefined): boolean => {
  return !isNaN(Number(param)) && Number(param) > 0;
};

export default isValidPage;
