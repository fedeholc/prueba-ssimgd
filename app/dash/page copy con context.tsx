"use client";
import styles from "./page.module.css";
import SourcesList from "./SourcesList";
import { useContext, useEffect, useState } from "react";
import SelectedSource from "./SelectedSource";
import sourcesListReducer from "./sourcesListReducer";
import { Notify3, useNotify3 } from "../Notify/Notify";
import MyContext from "../context";

export default function Dash() {
  //const [sourceList, sourceListDispatch] = useReducer(sourcesListReducer, []);

  const context = useContext(MyContext);
  if (!context) {
    throw new Error("MyContext must be used within a MyContext.Provider");
  }
  const { sourceList, sourceListDispatch } = context;

  const [selecteditem, setSelectedItem] = useState<string>("");
  const { notify, notifyState } = useNotify3();

  useEffect(() => {
    if (sourceList.length > 0 && !selecteditem) {
      setSelectedItem(sourceList[0]._id);
    }
  }, [sourceList, selecteditem]);

  // TODO: cómo meter un notify en el context provider? con
  // TODO: no sería mejor un hook para traer datos y sin context?

  /*  useEffect(() => {
    async function fetchSourceListData() {
      setLoadingMessage("Loading sources...");
      notify.setBusy();
      try {
        const response = await fetch("/api/mongo/get-sources-list");
        if (!response.ok) {
          notify.setError(response.statusText);
          return;
        }
        const data = await response.json();
        if (!data) {
          notify.setError("No data received");
          return;
        }
        sourceListDispatch({ type: "load", payload: data });
        if (data.length > 0) {
          setSelectedItem(data[0]._id);
        }
        setLoadingMessage("");
        notify.clear();
      } catch (error: unknown) {
        notify.setError(String(error));
      }
    }
    fetchSourceListData();
  }, [notify]); */

  async function handleSelectionChange(selectedItem: string) {
    if (!selectedItem) {
      return;
    }
    setSelectedItem(selectedItem);
  }

  // adds a new source to the list, selects it
  // the new source is not saved to the database until the user clicks "Save"
  // the new source is identified by the _id "0"
  //TODO: no permitir sumar uno nuevo si aun hay uno nuevo abierto sin guardar
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

          <Notify3 state={notifyState} />

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
