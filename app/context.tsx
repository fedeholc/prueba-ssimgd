"use client";

import { createContext, Dispatch } from "react";
import { useReducer, useEffect } from "react";
import sourcesListReducer from "./dash/sourcesListReducer";

const MyContext = createContext<{
  sourceList: SourceId[];

  sourceListDispatch: Dispatch<SourceListAction>;
} | null>(null);

export default MyContext;

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [sourceList, sourceListDispatch] = useReducer(sourcesListReducer, []);

  useEffect(() => {
    async function fetchSourceListData() {
      try {
        const response = await fetch("/api/mongo/get-sources-list");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!data) {
          return;
        }
        sourceListDispatch({ type: "load", payload: data });
      } catch (error: unknown) {}
    }
    fetchSourceListData();
  }, []);

  return (
    <MyContext.Provider value={{ sourceList, sourceListDispatch }}>
      {children}
    </MyContext.Provider>
  );
}
