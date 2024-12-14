"use client";
import styles from "./page.module.css";
import SelectableList from "./SelectableList";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import useFetchSeries from "./useFetchSeries";
import useFetchOneSeries from "./useFetchOneSeries";
import React, { useEffect, useState, useReducer } from "react";
import SelectedItem from "./SelectedItem";
import useFetchOneSeriesById from "./useFetchOneSeriesById";

function sourcesReducer(state: Source[], action: SourceListAction): Source[] {
  switch (action.type) {
    case "add":
      return [action.payload, ...state];
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
  const [sourceList, sourceListDispatch] = useReducer(sourcesReducer, []);
  const [selecteditem, setSelectedItem] = useState<string>("");

  const {
    selectedData,
    isLoading: isLoadingSelectedData,
    error: selectedDataError,
  } = useFetchOneSeriesById(selecteditem);

  //TODO: hay que hacer que traiga solo los ids y nombres
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
      sourceListDispatch({ type: "load", payload: data });
      if (data.length > 0) {
        setSelectedItem(data[0]._id);
      }
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

  function handleNewSource() {
    sourceListDispatch({
      type: "add",
      payload: {
        _id: "0",
        name: "New source",
        url: "",
        pages: [],
      },
    });
    handleSelectionChange("0");
  }

  return (
    <div>
      <h1>Dashboard page</h1>
      <button onClick={handleNewSource}>New source</button>

      <div className={styles.grid}>
        <div>
          <h2>Series</h2>

          {sourceList?.length > 0 && (
            <SelectableList
              items={sourceList}
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
              selectedItem={selecteditem}
              sourceDispatch={sourceListDispatch}
              setSelectedItem={setSelectedItem}
            />
          )}
        </div>
      </div>
    </div>
  );
}
