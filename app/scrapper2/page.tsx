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

type Action = { type: "add"; payload: Page } | { type: "reset-pages" };

const endPoints = {
  getSubPages: "/api/get-subpages",
  getImages: "/api/get-images",
};

export default function Scrapper2() {
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [sourceName, setSourceName] = useState<string>("");
  const [sourceFetchOption, setSourceFetchOption] = useState<string>("base");
  const [SPFilterInclude, setSPFilterInclude] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const [sourceReducer, dispatch] = useReducer(
    (state: Source, action: Action) => {
      switch (action.type) {
        case "add":
          return { ...state, pages: [...state.pages, action.payload] };
        case "reset-pages":
          return { ...state, pages: [] };
        default:
          return state;
      }
    },
    { name: "", url: "", pages: [] }
  );

  async function handleGetData() {
    setIsLoading(true);
    dispatch({ type: "reset-pages" });
    setLoadingMessage("Cargando páginas...");

    try {
      const sanitizedUrl =
        sourceUrl.startsWith("http://") || sourceUrl.startsWith("https://")
          ? sourceUrl
          : "https://" + sourceUrl;
      const pages = [sanitizedUrl];

      if (sourceFetchOption === "subpages") {
        pages.push(...(await getSubPages(endPoints.getSubPages, sourceUrl)));
      }

      let count = 0;
      for (const page of pages) {
        count++;
        setLoadingMessage(`Cargando páginas...(${count}/${pages.length})`);
        try {
          const imgUrls: string[] = await getImages(endPoints.getImages, page);
          dispatch({ type: "add", payload: { url: page, images: imgUrls } });
        } catch (error) {
          console.error(`Error fetching images for ${page}:`, error);
          dispatch({ type: "add", payload: { url: page, images: [] } });
        }
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <h3>Add a new source</h3>
      <label>Name</label>
      <input
        type="text"
        value={sourceName}
        onChange={(e) => setSourceName(e.target.value)}
      />
      <label>URL</label>
      <input
        type="text"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
      />
      <div>
        <label>
          <input
            type="radio"
            name="fetchOption"
            value="base"
            defaultChecked
            onChange={() => setSourceFetchOption("base")}
          />
          Fetch only base URL
        </label>
        <label>
          <input
            type="radio"
            name="fetchOption"
            value="subpages"
            onChange={() => setSourceFetchOption("subpages")}
          />
          Fetch with subpages
        </label>
      </div>
      <button onClick={handleGetData} disabled={isLoading || !sourceUrl}>
        {isLoading ? loadingMessage : "Download Data"}
      </button>

      {/*  <label>Sub Pages Filter</label>
      <input
        type="text"
        value={SPFilterInclude}
        onChange={(e) => setSPFilterInclude(e.target.value)}
      />
 */}
      {isLoading && <div>{loadingMessage}</div>}

      {sourceReducer.pages.length > 0 && (
        <PagesDisplay pages={sourceReducer.pages} />
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
        <details key={`${page.url}${index}`}>
          <summary>
            {page.url} - {page.images?.length || 0} images
          </summary>

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
        </details>
      ))}
    </div>
  );
}

async function getSubPages(apiEndPoint: string, sourceUrl: string) {
  const sanitizedUrl =
    sourceUrl.startsWith("http://") || sourceUrl.startsWith("https://")
      ? sourceUrl
      : "https://" + sourceUrl;
  const response = await fetch(apiEndPoint, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ url: sanitizedUrl }),
  });
  const data = await response.json();
  return data;
}

async function getImages(apiEndPoint: string, pageUrl: string) {
  const response = await fetch(apiEndPoint, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ url: pageUrl }),
  });
  const data = await response.json();
  return data;
}
