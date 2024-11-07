import { useCallback, useEffect, useState } from "react";
import apiResponse from "../types/apiResponse";

const useFetchData = <T>(
  endpoint: string,
  initalState: T,
  autoFetch = true
) => {
  const [data, setData] = useState<T | null>(initalState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(
    async (
      option?: RequestInit,
      queryParameters?: Record<string, string | number>
    ) => {
      setIsLoading(true);

      try {
        if (option?.method?.toLocaleUpperCase() !== "GET" && queryParameters) {
          throw new Error();
        }

        const query = queryParameters
          ? `?${new URLSearchParams(queryParameters as any).toString()}`
          : "";

        const response = await fetch(`${endpoint}${query}`, option);
        const jsonData = (await response.json()) as apiResponse;

        if (jsonData.message) {
          alert(jsonData.message);
        }

        setData(jsonData.data);
        setIsLoading(false);
      } catch {
        setError("데이터 처리 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    },
    [endpoint]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, isLoading, error, fetchData };
};

export default useFetchData;
