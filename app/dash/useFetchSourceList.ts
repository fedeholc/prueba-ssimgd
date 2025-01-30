
import { useState, useEffect } from "react";

export function useFetchSourceList(): { data: SourceListItem[]; isLoading: boolean; done: boolean; error: string | null } {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSourceListData() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/mongo/get-sources-list");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!data) {
          return;
        }
        setData(data);
        setIsLoading(false);
        setDone(true);
      } catch (error: unknown) {
        console.error(error);
        setError(String(error));
        setIsLoading(false);
      }
    }
    fetchSourceListData();
  }, []);

  return { data, isLoading, done, error };
}