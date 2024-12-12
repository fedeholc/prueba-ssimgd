/* eslint-disable @next/next/no-img-element */
//VER en este componente va mostrando a medida que descarga
"use client";
import styles from "./page.module.css";
import { useState, useReducer } from "react";

type Page = {
  url: string;
  images: string[];
};
type Source = {
  name: string;
  url: string;
  pages: Page[];
};

export default function Scrapper2() {
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [SPFilterInclude, setSPFilterInclude] = useState<string>("");
 
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

 
  const [sourceReducer, dispatch] = useReducer((state: Source, action: { type: string; payload: Page; }) => {
    switch (action.type) {
      case "add":
        return { ...state, pages: [...state.pages, action.payload] };
      default:
        return state;
    }
  }
  , { name: "", url: "", pages: [] });


  async function handleGetSubPages() {
    console.log("----- llamo a handleGetSubPages");
    setIsLoading(true);
    setLoadingMessage("Cargando subpáginas...");
 
    try {
      const sanitizedUrl = sourceUrl.startsWith("http://") || sourceUrl.startsWith("https://") ? sourceUrl : "https://" + sourceUrl;
      const response = await fetch("/api/get-subpages", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ url: sanitizedUrl }),
      });
      const { subPages } = await response.json();
 
      let count = 0;
       for (const subPage of subPages) {
        try {
          count++;
          setLoadingMessage(
            `Cargando subpáginas...(${count}/${subPages.length})`
          );

          const response = await fetch("/api/get-images", {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ url: subPage }),
          });
          const imgUrls: string[] = await response.json();
          console.log("imgUrls", imgUrls);
          dispatch({ type: "add", payload: { url: subPage, images: imgUrls } });

        } catch (error) {
          console.error(`Error fetching images for ${subPage}:`, error);
          dispatch({ type: "add", payload: { url: subPage, images: [] } });
        }
      }
    } catch (error) {
      console.error("Error fetching subpages:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <label>Web</label>
      <input
        type="text"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
      />
      <button onClick={handleGetSubPages} disabled={isLoading || !sourceUrl}>
        {isLoading ? loadingMessage : "Enviar"}
      </button>

      <label>Sub Pages Filter</label>
      <input
        type="text"
        value={SPFilterInclude}
        onChange={(e) => setSPFilterInclude(e.target.value)}
      />

      {isLoading && <div>{loadingMessage}</div>}

      {sourceReducer.pages.length > 0 && (
        <div>
          <PagesDisplay pages={sourceReducer.pages} />
        </div>
      )}

      <div>------------------------------------------</div>
    </div>
  );
}

function PagesDisplay({ pages }: { pages: Page[] }) {
  console.log("Init PagesDisplay", pages);
  return (
    <div>
      {pages.map((page, index) => (
        <div key={`${page.url}${index}`}>
          <div>
            {page.url}
            {index}
          </div>

          <div className="img-grid">
            {page.images?.length === 0 && <div>No hay imágenes</div>}
            {page.images?.map((image: string, index: number) => (
              <div key={image}>
                <a href={image} target="_blank" rel="noopener noreferrer">
                  {image}
                </a>
                <img
                  style={{ maxHeight: "200px" }}
                  src={image}
                  alt={`Imagen ${index}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
