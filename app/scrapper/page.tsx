/* eslint-disable @next/next/no-img-element */
//VER en este componente va mostrando a medida que descarga
"use client";
import styles from "./page.module.css";
import { useState } from "react";

type Image = {
  imageUrl: string;
  include: boolean;
};

type Page = {
  [key: string]: {
    imageUrl: string;
    include: boolean;
  }[];
};

export default function Scrapper() {
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [SPFilterInclude, setSPFilterInclude] = useState<string>("");
  const [page, setPage] = useState<Page>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const handleGetSubPages = async () => {
    setIsLoading(true);
    setLoadingMessage("Cargando subpáginas...");
    setPage({}); // Reset page state

    try {
      const response = await fetch("/api/get-subpages", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ url: "https://" + sourceUrl }),
      });
      const { subPages } = await response.json();

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
          setPage((prevPage) => ({
            ...prevPage,
            [subPage]:
              imgUrls?.map((image) => ({
                imageUrl: image,
                include: false,
              })) || [],
          }));
        } catch (error) {
          console.error(`Error fetching images for ${subPage}:`, error);
          // Optionally update state to show error for this subpage
          setPage((prevPage) => ({
            ...prevPage,
            [subPage]: [],
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching subpages:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

      {Object.keys(page).length > 0 && (
        <div>
          {Object.keys(page).map((subPage) => (
            <div key={subPage}>
              <div>{subPage}</div>

              <div className="img-grid">
                {page[subPage].length === 0 && <div>No hay imágenes</div>}
                {page[subPage]?.map((image: Image, index: number) => (
                  <div key={image.imageUrl}>
                    <a
                      href={image.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {image.imageUrl}
                    </a>
                    <img
                      style={{ maxHeight: "200px" }}
                      src={image.imageUrl}
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
