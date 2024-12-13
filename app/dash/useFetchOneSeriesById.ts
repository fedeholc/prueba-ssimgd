import { useEffect, useState } from "react";


export default function useFetchOneSeriesById(selectedItem: string | null) {
  const [selectedData, setSelectedData] = useState<Source | null>(null);
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
          "http://localhost:3000/api/mongo/get-one-series-by-id",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: selectedItem }),
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


    console.log("selectedItem: ", selectedItem);
    if (selectedItem === "0") {
      setSelectedData({
        _id: "0",
        name: "name",
        url: "url",
        pages: [],
      });

    } else {

      fetchSelectedData();
    }
  }, [selectedItem]);

  console.log("Mando selectedData: ", selectedData);
  return { selectedData, isLoading, error };
}