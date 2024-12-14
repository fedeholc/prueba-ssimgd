import PagesDisplay from "./PagesDisplay";
import React, { useEffect, useState, useReducer } from "react";
const endPoints = {
  getSubPages: "/api/get-subpages",
  getImages: "/api/get-images",
};

export default function SelectedItem({
  selectedItem,
  sourceDispatch: sourcesDispatch,
  setSelectedItem,
}: {
  selectedItem: string;
  sourceDispatch: React.Dispatch<SourceListAction>;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [sourceFetchOption, setSourceFetchOption] = useState<string>("base");

  async function handleSaveSource() {
    console.log("Saving source...");
    if (source._id === "0") {
      const response = await fetch("/api/mongo/save-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: {
            name: source.name,
            url: source.url,
            pages: source.pages,
          },
        }),
      });
      alert("Source saved!");
      const data = await response.json();
      //setSourceId(data.insertedId);
      console.log("Response:", data);
      sourcesDispatch({ type: "remove", payload: "0" });
      sourcesDispatch({
        type: "add",
        payload: {
          _id: data.insertedId,
          name: source.name,
          url: source.url,
          pages: source.pages,
        },
      });
      setSelectedItem(data.insertedId);
    } else {
      console.log("Source already saved");
      const response = await fetch("/api/mongo/update-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: {
            _id: source._id,
            name: source.name,
            url: source.url,
            pages: source.pages,
          },
        }),
      });
      alert("Source updated!");
      const data = await response.json();
      console.log("Response:", data);
      sourcesDispatch({
        type: "update",
        payload: {
          _id: source._id,
          name: source.name,
          url: source.url,
          pages: source.pages,
        },
      });
      setSelectedItem(source._id!);
    }
  }

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const [source, sourceDispatch] = useReducer(
    (state: Source, action: OneSourceAction) => {
      switch (action.type) {
        case "add":
          return { ...state, pages: [...state.pages, action.payload] };
        case "reset-pages":
          return { ...state, pages: [] };
        case "update":
          return state._id === action.payload._id ? action.payload : state;
        case "load":
          return action.payload;
        default:
          return state;
      }
    },
    { name: "", url: "", pages: [] }
  );

  useEffect(() => {
    async function fetchSourceData() {
      const response = await fetch(
        "http://localhost:3000/api/mongo/get-one-series-by-id",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedItem }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      const responseData = await response.json();
      sourceDispatch({ type: "load", payload: responseData });
    }

    if (selectedItem === "0") {
      sourceDispatch({
        type: "load",
        payload: {
          _id: "0",
          name: "name",
          url: "url",
          pages: [],
        },
      });
    } else {
      fetchSourceData();
    }
  }, [selectedItem]);

  async function handleGetData() {
    setIsLoading(true);
    sourceDispatch({ type: "reset-pages" });
    setLoadingMessage("Cargando páginas...");

    try {
      const sanitizedUrl =
        source.url.startsWith("http://") || source.url.startsWith("https://")
          ? source.url
          : "https://" + source.url;
      const pages = [sanitizedUrl];

      if (sourceFetchOption === "subpages") {
        pages.push(...(await getSubPages(endPoints.getSubPages, source.url)));
      }

      let count = 0;
      for (const page of pages) {
        count++;
        setLoadingMessage(`Cargando páginas...(${count}/${pages.length})`);
        try {
          const imgUrls: string[] = await getImages(endPoints.getImages, page);
          sourceDispatch({
            type: "add",
            payload: { url: page, images: imgUrls },
          });
        } catch (error) {
          console.error(`Error fetching images for ${page}:`, error);
          sourceDispatch({ type: "add", payload: { url: page, images: [] } });
        }
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {selectedItem && (
        <div>
          <div>Name: {source.name}</div>
          <div>URL: {source.url}</div>

          <div>Source Id: {source._id}</div>
          <label>Name</label>
          <input
            type="text"
            value={source.name}
            onChange={(e) =>
              sourceDispatch({
                type: "update",
                payload: { ...source, name: e.target.value },
              })
            }
          />
          <label>URL</label>
          <input
            type="text"
            value={source.url}
            onChange={(e) =>
              sourceDispatch({
                type: "update",
                payload: { ...source, url: e.target.value },
              })
            }
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
          <button onClick={handleSaveSource}>Save Source</button>
          <button onClick={handleGetData} disabled={isLoading || !source.url}>
            {isLoading ? loadingMessage : "Download Data"}
          </button>
          <PagesDisplay pages={source.pages || []} />
        </div>
      )}
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
