"use client";
import styles from "./page.module.css";
import SourcesList from "./SourcesList";
import React, { useEffect, useState, useReducer } from "react";
import SelectedSource from "./SelectedSource";
import sourcesListReducer from "./sourcesListReducer";

export default function Dash() {
  const [sourceList, sourceListDispatch] = useReducer(sourcesListReducer, []);
  const [selecteditem, setSelectedItem] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  // loads the list of sources and selects the first one
  useEffect(() => {
    async function fetchSourceListData() {
      setLoadingMessage("Loading sources...");
      const response = await fetch("/api/mongo/get-sources-list");
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
      setLoadingMessage("");
    }
    fetchSourceListData();
  }, []);

  async function handleSelectionChange(selectedItem: string) {
    if (!selectedItem) {
      return;
    }
    setSelectedItem(selectedItem);
  }

  // adds a new source to the list, selects it
  // the new source is not saved to the database until the user clicks "Save"
  // the new source is identified by the _id "0"
  function handleNewSource() {
    sourceListDispatch({
      type: "add",
      payload: {
        _id: "0",
        name: "New source",
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

          {loadingMessage && <p>{loadingMessage}</p>}
          {sourceList?.length === 0 && !loadingMessage && (
            <p>No sources found</p>
          )}
          {sourceList?.length > 0 && (
            <SourcesList
              items={sourceList}
              handleSelectionChange={handleSelectionChange}
              selectedItem={selecteditem}
            />
          )}
        </div>
        <div>
          <h2>Selected item</h2>

          <SelectedSource
            selectedItem={selecteditem}
            sourceDispatch={sourceListDispatch}
            setSelectedItem={setSelectedItem}
          />
        </div>
      </div>
    </div>
  );
}
