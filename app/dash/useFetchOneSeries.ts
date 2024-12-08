import { useEffect, useState } from "react";

type Series = {
  name: string;
  url: string;
};

export default function useFetchOneSeries(selectedItem: string|null) {
  const [selectedData, setSelectedData] = useState<Series | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state cuando no hay item seleccionado
    if (!selectedItem) {
      setSelectedData(null);
      setError(null);
      return;
    }

    async function fetchSelectedData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "http://localhost:3002/api/mongo/get-one-series",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: selectedItem }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }

        const responseData = await response.json();
        setSelectedData(responseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setSelectedData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSelectedData();
  }, [selectedItem]);

  return { selectedData, isLoading, error };
}