
import { useState, useEffect } from "react";

export function useFetchSourceList(): { data: SourceListItem[]; isLoading: boolean; isDone: boolean; error: string | null } {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
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
        setIsDone(true);
      } catch (error: unknown) {
        console.error(error);
        setError(String(error));
        setIsLoading(false);
      }
    }
    fetchSourceListData();
  }, []);

  return { data, isLoading, isDone, error };
}