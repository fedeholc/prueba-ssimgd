"use client";
import styles from "./page.module.css";
import SelectableList from "./SelectableList";
import customStyles from "./customStyles.module.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import useFetchSeries from "./useFetchSeries";
import useFetch from "./useFetch";
import useFetchOneSeries from "./useFetchOneSeries";
import React, { useEffect, useState, useReducer } from "react";
import PagesDisplay from "../scrapper2/PagesDisplay";

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
  } = useFetchOneSeries(selecteditem ?? null);

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
      <h1>Dashboard</h1>
      <p>Dashboard content</p>
      <div className={styles.grid}>
        <div>
          <h2>Series</h2>

          {sources?.length > 0 && (
            <SelectableList
              //items={data.map((e: Source) => e.name)}
              items={sources.map((e: Source) => e.name)}
              onSelectionChange={handleSelectionChange}
              mode="single"
              selectedItem={selecteditem}
              setSelectedItem={setSelectedItem}
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

function SelectedItem({
  selectedItem,
  dispatch,
  setSelectedItem,
}: {
  selectedItem: Source;
  dispatch: React.Dispatch<SourceAction>;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [sourceUrl, setSourceUrl] = useState<string>(selectedItem.url);
  const [sourceName, setSourceName] = useState<string>(selectedItem.name);
  const [sourceFetchOption, setSourceFetchOption] = useState<string>("base");
  const [sourceId, setSourceId] = useState<string>(selectedItem._id || "");

  /*   useEffect(() => {
    setSourceUrl(selectedItem.url);
    setSourceName(selectedItem.name);
    setSourceId(selectedItem._id || "");
  }, [selectedItem]); */

  async function handleSaveSource() {
    console.log("Saving source...");
    if (!sourceId) {
      const response = await fetch("/api/mongo/save-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: {
            name: sourceName,
            url: sourceUrl,
            pages: selectedItem.pages,
          },
        }),
      });
      alert("Source saved!");
      const data = await response.json();
      setSourceId(data.insertedId);
      console.log("Response:", data);
    } else {
      console.log("Source already saved");
      const response = await fetch("/api/mongo/update-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: {
            _id: sourceId,
            name: sourceName,
            url: sourceUrl,
            pages: selectedItem.pages,
          },
        }),
      });
      alert("Source updated!");
      const data = await response.json();
      console.log("Response:", data);
      dispatch({
        type: "update",
        payload: {
          _id: sourceId,
          name: sourceName,
          url: sourceUrl,
          pages: selectedItem.pages,
        },
      });
      setSelectedItem(sourceName);
    }
  }

  return (
    <div>
      {selectedItem && (
        <div>
          <div>Name: {selectedItem.name}</div>
          <div>URL: {selectedItem.url}</div>

          <div>Source Id: {sourceId}</div>
          <label>Name</label>
          <input
            type="text"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
          />
          <label>URL</label>
          <input
            type="text"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />
          <div>
            <label>
              <input
                type="radio"
                name="fetchOption"
                value="base"
                defaultChecked
                onChange={() => setSourceFetchOption("base")}
              />
              Fetch only base URL
            </label>
            <label>
              <input
                type="radio"
                name="fetchOption"
                value="subpages"
                onChange={() => setSourceFetchOption("subpages")}
              />
              Fetch with subpages
            </label>
          </div>
          <button onClick={handleSaveSource}>Save Source</button>
          <PagesDisplay pages={selectedItem?.pages || []} />
        </div>
      )}
    </div>
  );
}
