/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

type ImageLinks = {
  [key: string]: string[];
};

export default function Home() {
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [subPages, setSubPages] = useState<string[] | null>(null);
  const [imageLinks, setImageLinks] = useState<ImageLinks | null>(null);
  const [SPFilterInclude, setSPFilterInclude] = useState<string>("");

  async function handleGetSubPages() {
    const response = await fetch("/api/get-subpages", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ url: "https://" + sourceUrl }),
    });
    const { subPages } = await response.json();
    setSubPages(subPages);
    console.log("subpages:", subPages);
  }

  async function handleGetImages(e: React.MouseEvent<HTMLButtonElement>) {
    /*     const response = await fetch("/api/get-images", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ url: "https://" + sourceUrl }),
    });
    const data = await response.json(); */
    console.log("data:", e, (e.target as HTMLButtonElement).name);
    const url = (e.target as HTMLButtonElement).name;
    const response = await fetch("/api/get-images", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ url: (e.target as HTMLButtonElement).name }),
    });
    const data: ImageLinks = await response.json();
    setImageLinks((prev) => ({ ...prev, [url]: data.imageLinks }));
    console.log("images:", data);
  }

  useEffect(() => {
    console.log("Home Render");
  }, []);

  function subPagesFilter(subPage: string) {
    return subPage.includes(SPFilterInclude);
  }
  return (
    <div className={styles.page}>
      <input
        type="text"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
      />
      <button onClick={handleGetSubPages}>Enviar </button>
      <input type="text" value={SPFilterInclude} onChange={(e) => setSPFilterInclude(e.target.value)} />

      <div>subpages:</div>
      {subPages && (
        <div>
          {subPages.filter(subPagesFilter).map((subPage, index) => (
            <div key={subPage + index}>
              <div>{subPage}</div>
              <button name={subPage} onClick={(e) => handleGetImages(e)}>
                get images
              </button>
              {imageLinks && imageLinks[subPage] && (
                <div className="img-grid">
                  {imageLinks[subPage]?.map((image: string, index: number) => (
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
