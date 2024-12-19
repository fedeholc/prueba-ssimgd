"use client";
import { useState } from "react";
import { saveForm } from "./saveForm";
export default function ItemForm({ sourceItem }: { sourceItem: Source }) {
  const [source, setSource] = useState<Source>(sourceItem);

  return (
    <div>
      <input
        type="text"
        value={source.name}
        onChange={(e) =>
          setSource({
            ...source,
            name: e.target.value,
          })
        }
        /* onChange={(e) =>
          sourceDispatch({
            type: "update",
            payload: { ...source, name: e.target.value },
          })
        } */
      />
      <button
        onClick={async () => {
          const result = await saveForm(source);
          console.log("result", result);
        }}
      >
        Save
      </button>
    </div>
  );
}
