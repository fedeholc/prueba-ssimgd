"use client";
 import SelectableList from "./SelectableList";
import customStyles from "./customStyles.module.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import useFetchSeries from "./useFetchSeries";
import useFetch from "./useFetch";

type Series = {
  name: string;
  url: string;
};

export default function SeriesList() {
  /* const { data, isLoading, error } = useFetchSeries(
    "http://localhost:3000/api/mongo"
  ); */
  const { data, isLoading, error } = useFetch<Series[]>(
    "http://localhost:3000/api/mongo"
  );

  function handleSelectionChange(selectedItems: string[]) {
    console.log("Elementos seleccionados:", selectedItems);
  }

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los datos: {error}</div>;

  return (
    <div>
      {data && (
        <SelectableList
          items={data.map((e: Series) => e.name)}
          onSelectionChange={handleSelectionChange}
          styles={customStyles}
        />
      )}
    </div>
  );
}
