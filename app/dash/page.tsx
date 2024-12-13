"use client";
import styles from "./page.module.css";
import SelectableList from "./SelectableList";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import useFetchSeries from "./useFetchSeries";
import useFetchOneSeries from "./useFetchOneSeries";
import React, { useEffect, useState, useReducer } from "react";
import SelectedItem from "./SelectedItem";

function sourcesReducer(state: Source[], action: SourceAction): Source[] {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "remove":
      return state.filter((source) => source._id !== action.payload);
    case "update":
      return state.map((source) =>
        source._id === action.payload._id ? action.payload : source
      );
    case "load":
      return action.payload;
    default:
      return state;
  }
}
export default function Dash() {
  const [sources, dispatch] = useReducer(sourcesReducer, []);

  const [selecteditem, setSelectedItem] = useState<string>("");

  const {
    selectedData,
    isLoading: isLoadingSelectedData,
    error: selectedDataError,
  } = useFetchOneSeries(selecteditem);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/mongo/get-all-series");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      if (!data) {
        return;
      }
      dispatch({ type: "load", payload: data });
    }
    fetchData();
  }, []);

  async function handleSelectionChange(selectedItem: string) {
    console.log("handle Selected items: ", selectedItem);
    if (!selectedItem) {
      return;
    }
    setSelectedItem(selectedItem);
  }

  return (
    <div>
      <h1>Dashboard page</h1>
      <div className={styles.grid}>
        <div>
          <h2>Series</h2>

          {sources?.length > 0 && (
            <SelectableList
              items={sources.map((e: Source) => e.name)}
              onSelectionChange={handleSelectionChange}
              selectedItem={selecteditem}
            />
          )}
        </div>
        <div>
          <h2>Selected item</h2>

          {isLoadingSelectedData && <div>Cargando datos seleccionados...</div>}
          {selectedDataError && <div>Error: {selectedDataError}</div>}
          {!isLoadingSelectedData && selectedData && (
            <SelectedItem
              selectedItem={selectedData}
              dispatch={dispatch}
              setSelectedItem={setSelectedItem}
            />
          )}
        </div>
      </div>
    </div>
  );
}
