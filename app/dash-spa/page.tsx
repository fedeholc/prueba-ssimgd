"use client";
import styles from "./page.module.css";
import SourceList from "./SourceList";
import { useEffect, useState } from "react";
import Source from "./Source";
import { Notify4 } from "../Notify/Notify";
import { useSourceList } from "./useSourceList";

export default function Dash() {

  const { sourceList, actions: sourceListAction, isLoading, isDone, error } = useSourceList();
  const [selecteditem, setSelectedItem] = useState<string>("");

  useEffect(() => {
      if (sourceList && sourceList.length > 0 && selecteditem === "") {
        setSelectedItem(sourceList[0]._id);
      } 
  }, [sourceList, selecteditem]);

  async function handleSelectionChange(selectedItem: string) {
    if (!selectedItem) {
      return;
    }
    setSelectedItem(selectedItem);
  }

  // adds a new source to the list, selects it
  // the new source is not saved to the database until the user clicks "Save"
  // the new source is identified by the _id "0"
  // the reducer will check if there is already a new source
  function handleNewSource() {
    sourceListAction.add({
      _id: "0",
      name: "New source",
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
            isDone={isDone}
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
            sourceListAction={sourceListAction}
            setSelectedItem={setSelectedItem}
          />
        </div>
      </div>
    </div>
  );
}
