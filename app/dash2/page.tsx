"use client";
import styles from "./page.module.css";
import SourceList from "./SourceList";
import { useEffect, useState } from "react";
import Source from "./Source";
//import sourceListReducer from "./sourceListReducer";
import { Notify4 } from "../Notify/Notify";
import { useFetchSourceList } from "./useFetchSourceList";
import { useSourceListReducer } from "./useSourceListReducer";

export default function Dash() {
  const { data: sourceListData, isLoading, done, error } = useFetchSourceList();

  const { sourceList, actions: sourceListAction } = useSourceListReducer();
  const [selecteditem, setSelectedItem] = useState<string>("");

  // Dispatch 'load' action when data changes
  useEffect(() => {
    //VER: ojo, por un lado el load lo tuve que poner para que cargue la lista en el reducer, pero por otro lado en los siguientes renders me volvia a cargar la lista original cuando la modificaba por ejemplo al agregar un nuevo item, por eso ahora checkea si la lista esta vacia antes de cargarla. Eso con la otra implementación del reducer sin hook no pasaba.
    //TODO: habría que probar que pasa si en el hook del reducer se hacer la carga de datos y no tenerlo separado, o sino también probar si funciona con un context.
    if (sourceListData && sourceListData.length > 0) {
      if (sourceList.length === 0) {
        sourceListAction.load(sourceListData);
        // select first item in the list if none is selected (e.g. after loading)
        setSelectedItem(sourceListData[0]._id);
      }
      //
    }
  }, [sourceList, sourceListData, sourceListAction]);

  async function handleSelectionChange(selectedItem: string) {
    if (!selectedItem) {
      return;
    }
    console.log("page handlechange", selectedItem);
    setSelectedItem(selectedItem);
  }

  // adds a new source to the list, selects it
  // the new source is not saved to the database until the user clicks "Save"
  // the new source is identified by the _id "0"
  function handleNewSource() {
    // the reducer will check if there is already a new source
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
            sourceListAction={sourceListAction}
            setSelectedItem={setSelectedItem}
          />
        </div>
      </div>
    </div>
  );
}
