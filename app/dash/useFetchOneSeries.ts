import { useEffect, useState } from "react";

type Series = {
  name: string;
  url: string;
};

export default function useFetchSeries(apiUrl: string, name: string) {
  const [data, setData] = useState<Series | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          apiUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: name }),
          }
        );
        if (!response.ok) {
          console.error("Error al obtener los datos");
          return;
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
  }, [apiUrl, name]);

  return { data, isLoading, error };
}
