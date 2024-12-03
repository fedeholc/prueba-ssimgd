"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [buscar, setBuscar] = useState<boolean>(false);
  async function prueba() {
    /*     console.log("Hola");
    const response = await fetch("/api/datos-stream");
    const data = await response.json();
    console.log(data); */
    setBuscar(true);
  }

  return (
    <div className={styles.page}>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={prueba}>Enviar {url}</button>

      {buscar && (
        <div>
          <ImageLinkExtractor url={url}></ImageLinkExtractor>
        </div>
      )}
    </div>
  );
}

const ImageLinkExtractor = ({ url }: { url: string }) => {
  const [imageLinks, setImageLinks] = useState<string[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImageLinks = async () => {
      setIsLoading(true);
      setImageLinks([]);
      setError(null);

      try {
        const response = await fetch(`/api/datos-stream`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ url: url }),
        });

        if (!response.ok) {
          throw new Error("Error al obtener los enlaces");
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        const processStream = async () => {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n").filter((line) => line.trim());

            lines.forEach((line) => {
              try {
                const imageData = JSON.parse(line);
                console.log("leo: ", imageData);
                // Actualizar estado inmediatamente
                setImageLinks((prev) =>
                  prev ? [...prev, imageData] : [imageData]
                );
              } catch {
                console.error("Error parsing line:", line);
              }
            });
          }
          setIsLoading(false);
        };

        processStream();
      } catch {
        setIsLoading(false);
      }
    };

    fetchImageLinks();
  }, [url]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Enlaces de imágenes {isLoading ? "Cargando..." : ""}</h2>
      {imageLinks?.map((image: any, index: number) => (
        <div key={image.url + index}>
          <a href={image.url} target="_blank" rel="noopener noreferrer">
            {image.url}
          </a>
        </div>
      ))}
    </div>
  );
};
