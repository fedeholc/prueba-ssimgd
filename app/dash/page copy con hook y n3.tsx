"use client";
import styles from "./page.module.css";
import SourcesList from "./SourcesList";
import { useReducer, useEffect, useState } from "react";
import SelectedSource from "./SelectedSource";
import sourcesListReducer from "./sourcesListReducer";
import { Notify3, useNotify3 } from "../Notify/Notify";
import { useFetchSourcesList } from "./useFetchSourcesList";

export default function Dash() {
  const { data: sourceListData, isLoading, error } = useFetchSourcesList();
  const [sourceList, sourceListDispatch] = useReducer(sourcesListReducer, []);
  const [selecteditem, setSelectedItem] = useState<string>("");
  const { notify, notifyState } = useNotify3();

  useEffect(() => {
    if (error) {
      notify.setError(error);
    }
    if (isLoading) {
      notify.setBusy();
    }
    if (!isLoading && !error) {
      notify.clear();
    }
  }, [error, isLoading, notify]);

  // Dispatch 'load' action when data changes
  useEffect(() => {
    if (sourceListData && sourceListData.length > 0) {
      sourceListDispatch({ type: "load", payload: sourceListData });
      // select first item in the list if none is selected (e.g. after loading)
      setSelectedItem(sourceListData[0]._id);
    }
  }, [sourceListData, sourceListDispatch]);

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
