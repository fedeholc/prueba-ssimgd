"use client";
import { useEffect, useState } from "react";
import SelectableList from "./SelectableList";

type Series = {
  name: string;
  url: string;
}

export default function SeriesList() {
  const [data, setData] = useState<Series[]>([]);
  useEffect(() => {
    async function getData() {
      const response = await fetch("http://localhost:3000/api/mongo", {
        method: "GET",
      });
      const responseData = await response.json();
      setData(responseData);
    }
    getData();
    console.log("SeriesList Render");
  }, []);

  function handleSelectionChange(selectedItems: string[]) {
    console.log("Elementos seleccionados:", selectedItems);
  }

  return (
    <div>
      <div>
        {data.map((e: Series, i: number) => (
          <p key={`${e.name}${i}`} data-prueba={e.name} id={e.name}>
            {e.name}
          </p>
        ))}
      </div>
      <SelectableList
        items={data.map((e: Series) => e.name)}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
