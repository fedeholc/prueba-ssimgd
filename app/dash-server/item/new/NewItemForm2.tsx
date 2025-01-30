"use client";
import { useState } from "react";
import { saveNewFormAction2 } from "./saveNewFormAction2";
import { useActionState } from "react";

export default function NewItemForm({ sourceItem }: { sourceItem: Source }) {
  const [source, setSource] = useState<Source>(sourceItem);

  const [state, submitAction, isPending] = useActionState(
    saveNewFormAction2,
    "initial"
  );

  //TODO: falta como manejar el resultado de la accion si es un error.
  
  return (
    <div>
      <form action={submitAction}>
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
        <input
          type="text"
          name="url"
          value={source.url}
          onChange={(e) =>
            setSource({
              ...source,
              url: e.target.value,
            })
          }
        />

        <p>
          state: {state ?? ""} - {isPending ? "pending" : "not pending"}
        </p>
        <button>Save</button>
      </form>
    </div>
  );
}
