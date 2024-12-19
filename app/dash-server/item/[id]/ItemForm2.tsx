"use client";
import { useState } from "react";
import { saveFormAction2 } from "./saveFormAction2";
import { useActionState } from "react";

export default function ItemForm({ sourceItem }: { sourceItem: Source }) {
  const [source, setSource] = useState<Source>(sourceItem);

  const [state, submitAction, isPending] = useActionState(
    saveFormAction2,
    "initial"
  );
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
          name="id"
          value={source._id}
          onChange={(e) =>
            setSource({
              ...source,
              _id: e.target.value,
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
