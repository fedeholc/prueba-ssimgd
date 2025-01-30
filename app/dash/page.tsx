"use client";
import styles from "./page.module.css";
import SourceList from "./SourceList";
import { useReducer, useEffect, useState } from "react";
import Source from "./Source";
import sourceListReducer from "./sourceListReducer";
import { Notify4 } from "../Notify/Notify";
import { useFetchSourceList } from "./useFetchSourceList";

export default function Dash() {
  const { data: sourceListData, isLoading, done, error } = useFetchSourceList();
  const [sourceList, sourceListDispatch] = useReducer(sourceListReducer, []);
  const [selecteditem, setSelectedItem] = useState<string>("");

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
  function handleNewSource() {
    // the reducer will check if there is already a new source
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

          <Notify4
            isBusy={isLoading}
            isError={error ? true : false}
            isDone={done}
            messages={{ busy: "ocupado", done: "listo" }}
          />

          {sourceList?.length > 0 && (
            <SourceList
              items={sourceList}
              handleSelectionChange={handleSelectionChange}
              selectedItem={selecteditem}
            />
          )}
        </div>
        <div>
          <h2>Selected item</h2>

          <Source
            selectedItem={selecteditem}
            sourceDispatch={sourceListDispatch}
            setSelectedItem={setSelectedItem}
          />
        </div>
      </div>
    </div>
  );
}
