"use client";
import { useState } from "react";
import { deleteItemAction } from "./deleteItemAction";

import { redirect } from "next/navigation";
 
export default function DeleteItemButton({ sourceId }: { sourceId: string }) {
  const [saveState, setSaveState] = useState("initial");

  return (
    <div>
      <p>delete state: {saveState} </p>
      <button
        onClick={async (e) => {
          e.preventDefault();
          setSaveState("pending");
          const result = await deleteItemAction(sourceId);
          console.log("result", result);
          setSaveState(result.acknowledged ? "ok" : "error");
          if (result.acknowledged) {
            redirect("/dash-server/item/");
          }
        }}
      >
        Delete
      </button>
    </div>
  );
}
