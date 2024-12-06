import { useEffect, useState } from 'react';
export default function useFetch<T>(apiUrl: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl, options);
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
  }, [apiUrl, options]);

  return { data, isLoading, error };
}
