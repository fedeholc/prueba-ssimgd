"use client";
import styles from "./page.module.css";
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
  const {
    selectedData,
    isLoading: isLoadingSelectedData,
    error: selectedDataError,
  } = useFetchOneSeries(selecteditems.length > 0 ? selecteditems[0] : null);


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
          <h2>Selected item</h2>

          {isLoadingSelectedData && <div>Cargando datos seleccionados...</div>}
          {selectedDataError && <div>Error: {selectedDataError}</div>}
          {selectedData && <SelectedItem selectedItem={selectedData} />}
        </div>
      </div>
    </div>
  );
}



function SelectedItem({ selectedItem }: { selectedItem: Series }) {
  return (
    <div>
      {selectedItem && (
        <div>
          <div>Name: {selectedItem.name}</div>
          <div>URL: {selectedItem.url}</div>
        </div>
      )}
    </div>
  );
}
