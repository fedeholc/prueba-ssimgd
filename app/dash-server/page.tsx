import styles from "./page.module.css";
import SourcesList2 from "./SourcesList2";
//import { useReducer, useEffect, useState } from "react";
import SelectedSource2 from "./SelectedSource2";
import sourcesListReducer from "./sourcesListReducer";
import { Notify4 } from "../Notify/Notify";
import { useFetchSourcesList } from "./useFetchSourcesList";
import Dash1 from "./dash1";
export default async function Dash() {
  /* const {
    data: sourceListData,
    isLoading,
    done,
    error,
  } = useFetchSourcesList();
  const [sourceList, sourceListDispatch] = useReducer(sourcesListReducer, []);
  const [selecteditem, setSelectedItem] = useState<string>(""); */

  const response = await fetch(
    "http://localhost:3000/api/mongo/get-sources-list"
  );
  console.log(response);
  if (!response.ok) {
    return;
  }
  const sourceList = await response.json();

  // Dispatch 'load' action when data changes
  /* useEffect(() => {
    if (sourceListData && sourceListData.length > 0) {
      sourceListDispatch({ type: "load", payload: sourceListData });
      // select first item in the list if none is selected (e.g. after loading)
      setSelectedItem(sourceListData[0]._id);
    }
  }, [sourceListData, sourceListDispatch]); */

  /* async function handleSelectionChange(selectedItem: string) {
    if (!selectedItem) {
      return;
    }
    setSelectedItem(selectedItem);
  } */

  // adds a new source to the list, selects it
  // the new source is not saved to the database until the user clicks "Save"
  // the new source is identified by the _id "0"
  /* function handleNewSource() {
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
 */
  return (
    <div>
      <h1>Dashboard page</h1>
      {/*       <button onClick={handleNewSource}>New source</button>
       */}
    </div>
  );
}
