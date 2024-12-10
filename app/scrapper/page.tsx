/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

type ImageLinks = {
  [key: string]: string[];
};

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
  const [page, setPage] = useState<Page | null>(null);

  async function handleGetSubPages() {
    const response = await fetch("/api/get-subpages", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ url: "https://" + sourceUrl }),
    });
    const { subPages } = await response.json();

    const page: Page = {};

    for (const subPage of subPages) {
      const response = await fetch("/api/get-images", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ url: subPage }),
      });
      const data: ImageLinks = await response.json();
      page[subPage] = data.imageLinks?.map((image) => ({
        imageUrl: image,
        include: false,
      }));
    }
    console.log("page:", page);
    setPage(page);
  }


  useEffect(() => {
    console.log("Home Render");
  }, []);

  return (
    <div className={styles.page}>
      <label>Web</label>
      <input
        type="text"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
      />
      <button onClick={handleGetSubPages}>Enviar </button>
      <label>Sub Pages Filter</label>
      <input
        type="text"
        value={SPFilterInclude}
        onChange={(e) => setSPFilterInclude(e.target.value)}
      />

      { page && (
        <div>
          {Object.keys(page).map((subPage, index) => (
            <div key={subPage + index}>
              <div>{subPage}</div>
          
              {page[subPage] && (
                <div className="img-grid">
                  {page[subPage].length === 0 && <div>No hay imágenes</div>}
                  {page[subPage]?.map((image: Image, index: number) => (
                    <div key={image.imageUrl}>
                      <a href={image.imageUrl} target="_blank" rel="noopener noreferrer">
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
              )}
            </div>
          ))}
        </div>
      )}

      <div>------------------------------------------</div>
      
    </div>
  );
}
