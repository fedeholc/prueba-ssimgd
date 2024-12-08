"use client";
import styles from "./page.module.css";
import SeriesList from "./SeriesList";
import SelectableList from "./SelectableList";
import customStyles from "./customStyles.module.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import useFetchSeries from "./useFetchSeries";
import useFetch from "./useFetch";
import useFetchOneSeries from "./useFetchOneSeries";
import React, { useState } from "react";

type Series = {
  name: string;
  url: string;
};

export default function Dash() {
  /* const { data, isLoading, error } = useFetchSeries(
    "http://localhost:3000/api/mongo"
  ); */
  const { data, isLoading, error } = useFetch<Series[]>(
    "http://localhost:3002/api/mongo"
  );

  const [selecteditems, setSelectedItems] = useState<string[]>([]);

  async function handleSelectionChange(selectedItems: string[]) {
    if (selectedItems.length === 0) {
      return;
    }
    console.log("Elementos seleccionados:", selectedItems);
    setSelectedItems(selectedItems);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Dashboard content</p>
      <div className={styles.grid}>
        <div
          onClick={(e: React.MouseEvent) => {
            console.log((e.target as HTMLElement).dataset.prueba);
          }}
        >
          <h2>Series</h2>
          {isLoading && <div>Cargando...</div>}
          {error && <div>Error al cargar los datos: {error}</div>}
          {data && (
            <SelectableList
              items={data.map((e: Series) => e.name)}
              onSelectionChange={handleSelectionChange}
              styles={customStyles}
              mode="single"
            />
          )}
        </div>
        <div>
          <h2>Data</h2>
         <SelectedItem selectedItem={selecteditems[0]} /> 
        </div>
      </div>
    </div>
  );
}

function SelectedItem({ selectedItem }: { selectedItem: string }) {
  const {
    data: seriesData,
    isLoading,
    error,
  } = useFetchOneSeries("http://localhost:3002/api/mongo/get-one-series", selectedItem);

  return (
    <div>
      <h2>Selected item</h2>

      {isLoading && <div>Cargando...</div>}
      {error && <div>Error al cargar los datos: {error}</div>}
      {seriesData && (
        <div>
          <div>Name: {seriesData.name}</div>
          <div>URL: {seriesData.url}</div>
        </div>
      )}
    </div>
  );
}
