"use client";
import styles from "./page.module.css";
import SeriesList from "./SeriesList";
import SelectableList from "./SelectableList";
import customStyles from "./customStyles.module.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import useFetchSeries from "./useFetchSeries";
import useFetch from "./useFetch";
import React, { useState, useEffect } from "react";

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
  const [selectedData, setSelectedData] = useState<Series | null>(null);

  async function handleSelectionChange(selectedItems: string[]) {
    if (selectedItems.length === 0) {
      return;
    }
    console.log("Elementos seleccionados:", selectedItems);
    setSelectedItems(selectedItems);
  }

  //TODO: pasar a hook
  useEffect(() => {
    async function loadSeries() {
      const response = await fetch(
        "http://localhost:3002/api/mongo/get-one-series",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: selecteditems[0] }),
        }
      );
      if (!response.ok) {
        console.error("Error al obtener los datos");
        return;
      }
      const data = await response.json();
      setSelectedData(data);
      console.log(data);
    }

    if (selecteditems.length === 0) {
      setSelectedData(null);
    } else {
      loadSeries();
    }
  }, [selecteditems]);

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
          {selecteditems && selectedData && (
            <div>
              <div>Selected items: {selecteditems.join(", ")}</div>
              <div>Name: {selectedData?.name}</div>
              <div>URL: {selectedData?.url}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
