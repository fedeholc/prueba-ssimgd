"use client";

import { createContext, Dispatch } from "react";
import { useReducer, useEffect } from "react";
import sourceListReducer from "./dash-spa/sourceListReducer";

const MyContext = createContext<{
  sourceList: SourceId[];

  sourceListDispatch: Dispatch<SourceListAction>;
} | null>(null);

export default MyContext;

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [sourceList, sourceListDispatch] = useReducer(sourceListReducer, []);

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
      } catch (error: unknown) {
        console.error(error);
      }
    }
    fetchSourceListData();
  }, []);

  return (
    <MyContext.Provider value={{ sourceList, sourceListDispatch }}>
      {children}
    </MyContext.Provider>
  );
}
