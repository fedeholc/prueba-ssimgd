"use client";
import { useState } from "react";
import { saveFormAction } from "./saveFormAction";

export default function ItemForm({ sourceItem }: { sourceItem: Source }) {
  const [source, setSource] = useState<Source>(sourceItem);

  const [saveState, setSaveState] = useState("initial");

  return (
    <div>
      <form >
        <label htmlFor="name">name:</label>
        <input
          type="text"
          name="name"
          value={source.name}
          onChange={(e) =>
            setSource({
              ...source,
              name: e.target.value,
            })
          }
        />
     
        <p>state: {saveState} </p>
        <button
         onClick={async () => {
            setSaveState("pending");
            const result = await saveFormAction(source);
            console.log("result", result);
            setSaveState(result.acknowledged ? "ok" : "error");
          }} 
        >
          Save
        </button>
      </form>
    </div>
  );
}
