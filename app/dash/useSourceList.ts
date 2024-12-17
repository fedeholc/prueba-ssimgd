
import { useEffect, useReducer, useState } from "react";
import sourcesListReducer from "./sourcesListReducer";
export function useSourcesList() {
  const [sourceList, sourceListDispatch] = useReducer(sourcesListReducer, []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSourceListData() {
      try {
        setIsLoading(true);
        console.log("date: ", new Date());
        const response = await fetch("/api/mongo/get-sources-list");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!data) {
          return;
        }

        sourceListDispatch({ type: "load", payload: data });
        setIsLoading(false);
      } catch (error: unknown) {
        console.error(error);
        setError(String(error));
        setIsLoading(false);
      }
    }
    fetchSourceListData();
  }, []);

  return { sourceList, sourceListDispatch, isLoading, error };
}