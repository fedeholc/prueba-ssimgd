import { useEffect, useState } from "react";

type Series = {
  name: string;
  url: string;
};

export default function useFetchSeries(apiUrl: string) {
  const [data, setData] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(apiUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [apiUrl]);

  return { data, isLoading, error };
}
