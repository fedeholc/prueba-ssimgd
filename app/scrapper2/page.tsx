/* eslint-disable @next/next/no-img-element */
//VER en este componente va mostrando a medida que descarga
"use client";
import styles from "./page.module.css";
import { useState } from "react";

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
  const [source, setSource] = useState<Source>({
    name: "",
    url: "",
    pages: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  console.log("source init", source);

  async function handleGetSubPages() {
    console.log("----- llamo a handleGetSubPages");
    setIsLoading(true);
    setLoadingMessage("Cargando subpáginas...");
    setSource({ name: "nombre para" + sourceUrl, url: sourceUrl, pages: [] }); // Reset page state
    try {
      const response = await fetch("/api/get-subpages", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ url: "https://" + sourceUrl }),
      });
      const { subPages } = await response.json();
      /* 
      subPages.push("https://" + sourceUrl);
      console.log("subPages", subPages); */
      let count = 0;
      // Process subpages sequentially with incremental updates
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
          // Update state incrementally for each subpage
          setSource((prevPage) => {
            console.log("add:", subPage);
            const temp = { ...prevPage };
            if (temp.pages[temp.pages.length - 1]?.url === subPage) {
              return prevPage;
            }
            temp.pages.push({ url: subPage, images: imgUrls });
            return temp;
          });
        } catch (error) {
          console.error(`Error fetching images for ${subPage}:`, error);
          // Optionally update state to show error for this subpage
          setSource((prevPage) => {
            const temp = { ...prevPage };
            temp.pages.push({ url: subPage, images: [] });
            return temp;
          });
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

      {source.pages.length > 0 && (
        <div>
          {source.pages.map((page, index) => (
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
      )}

      <div>------------------------------------------</div>
    </div>
  );
}
