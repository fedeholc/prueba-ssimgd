"use client";
import styles from "./page.module.css";
import SelectableList from "./SelectableList";
import customStyles from "./customStyles.module.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import useFetchSeries from "./useFetchSeries";
import useFetch from "./useFetch";
import useFetchOneSeries from "./useFetchOneSeries";
import React, { useEffect, useState } from "react";
import PagesDisplay from "../scrapper2/PagesDisplay";

export default function Dash() {
  /* const { data, isLoading, error } = useFetchSeries(
    "http://localhost:3000/api/mongo"
  ); */
  const { data, isLoading, error } = useFetch<Source[]>(
    "http://localhost:3000/api/mongo/get-all-series"
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
              items={data.map((e: Source) => e.name)}
              onSelectionChange={handleSelectionChange}
              mode="single"
            />
          )}
        </div>
        <div>
          <h2>Selected item</h2>

          {isLoadingSelectedData && <div>Cargando datos seleccionados...</div>}
          {selectedDataError && <div>Error: {selectedDataError}</div>}
          {!isLoadingSelectedData && selectedData && (
            <SelectedItem selectedItem={selectedData} />
          )}
        </div>
      </div>
    </div>
  );
}

function SelectedItem({ selectedItem }: { selectedItem: Source }) {
  const [sourceUrl, setSourceUrl] = useState<string>(selectedItem.url);
  const [sourceName, setSourceName] = useState<string>(selectedItem.name);
  const [sourceFetchOption, setSourceFetchOption] = useState<string>("base");
  const [sourceId, setSourceId] = useState<string>(selectedItem._id || "");

  useEffect(() => {
    setSourceUrl(selectedItem.url);
    setSourceName(selectedItem.name);
    setSourceId(selectedItem._id || "");
  }, [selectedItem]);

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
