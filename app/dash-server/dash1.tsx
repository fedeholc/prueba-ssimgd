"use client";
import SourcePrueba from "./SourcePrueba";
import SourcesList2 from "./SourcesList2";
import styles from "./page.module.css";
import { useState } from "react";

export default function Dash1({
  sourceList,
}: {
  sourceList: SourceListItem[];
}) {
  const [selecteditem, setSelectedItem] = useState<string>("");

  async function handleSelectionChange(selectedItem: string) {
    if (!selectedItem) {
      return;
    }
    setSelectedItem(selectedItem);
  }
  return (
    <div>
      <h1>Dashboard 1</h1>
      <div className={styles.grid}>
        <div>
          <h2>Series</h2>
          {/* <Notify4
              isBusy={isLoading}
              isError={error ? true : false}
              isDone={done}
              messages={{ busy: "ocupado", done: "listo" }}
            /> */}
          {sourceList?.length > 0 && (
            <SourcesList2
              items={sourceList}
              selectedItem={selecteditem}
              handleSelectionChange={handleSelectionChange}
            />
          )}
        </div>
        <div>
          <h2>Selected item</h2>
          <SourcePrueba selectedItem={selecteditem} />
          {/*  <SelectedSource
              selectedItem={selecteditem}
              sourceDispatch={sourceListDispatch}
              setSelectedItem={setSelectedItem}
            /> */}
        </div>
      </div>
    </div>
  );
}
