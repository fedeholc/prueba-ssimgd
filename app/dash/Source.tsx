import PagesDisplay from "./PagesDisplay";
import React, { useEffect, useState, useReducer } from "react";
import { getImages, getSubPages } from "./utils";
const endPoints = {
  getSubPages: "/api/get-subpages",
  getImages: "/api/get-images",
  saveSource: "/api/mongo/save-source",
  updateSource: "/api/mongo/update-source",
};

export default function Source({
  selectedItem,
  sourceDispatch: sourcesDispatch,
  setSelectedItem,
}: {
  selectedItem: string;
  sourceDispatch: React.Dispatch<SourceListAction>;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [sourceFetchOption, setSourceFetchOption] = useState<string>("base");
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [loadingImagesMessage, setLoadingImagesMessage] = useState<string>("");
  const [loadingSourceMessage, setLoadingSourceMessage] = useState<string>("");
  const [source, sourceDispatch] = useReducer(sourceReducer, {
    _id: "",
    name: "",
    url: "",
    pages: [],
  });

  // fetches the source data when the selected item changes and sends it to the
  // reducer. If it is a new source, it initializes the source with default
  // values
  useEffect(() => {
    if (!selectedItem) {
      return;
    }
    async function fetchSourceData() {
      try {
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
      } catch (error) {
        console.error("Error fetching source data:", error);
        // sourceDispatch({ type: "load", payload: {} });
      }
    }

    // for new sources
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
    }
    // for existing sources
    else {
      fetchSourceData();
    }
  }, [selectedItem]);

  // fetches the pages and images for the source
  async function handleGetData() {
    setIsLoadingImages(true);
    sourceDispatch({ type: "reset-pages" });
    setLoadingImagesMessage("Cargando páginas...");

    console.log("> > > handleGetData");
    try {
      const sanitizedUrl =
        source.url.startsWith("http://") || source.url.startsWith("https://")
          ? source.url
          : "https://" + source.url;

      // add the base url to the pages array
      const pages = [sanitizedUrl];

      if (sourceFetchOption === "subpages") {
        // add the subpages to the pages array
        pages.push(...(await getSubPages(endPoints.getSubPages, source.url)));
      }

      // get the images from each page
      let count = 0;
      for (const page of pages) {
        count++;
        setLoadingImagesMessage(`Loading page...(${count}/${pages.length})`);
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
      setIsLoadingImages(false);
    }
  }

  //TODO: cambiar los alerts por otra cosa
  async function handleSaveSource() {
    setLoadingSourceMessage("Saving source...");
    // if the source is new, save it
    if (source._id === "0") {
      try {
        const response = await fetch(endPoints.saveSource, {
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
        const data = await response.json();
        sourcesDispatch({ type: "remove", payload: "0" });
        sourcesDispatch({
          type: "add",
          payload: {
            _id: data.insertedId,
            name: source.name,
          },
        });
        setSelectedItem(data.insertedId);
      } catch (error) {
        console.error("Error saving source:", error);
        return;
      }
    }
    // if the source is not new, update it
    else {
      try {
        await fetch(endPoints.updateSource, {
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
        sourcesDispatch({
          type: "update",
          payload: {
            _id: source._id,
            name: source.name,
          },
        });
        setSelectedItem(source._id!);
      } catch (error) {
        console.error("Error updating source:", error);
        return;
      }
    }
    setLoadingSourceMessage("");
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
          <button
            onClick={handleSaveSource}
            disabled={loadingSourceMessage !== ""}
          >
            Save Source {loadingSourceMessage}
          </button>
          <button
            onClick={() => {
              handleGetData();
            }}
            disabled={isLoadingImages || !source.url}
          >
            {isLoadingImages ? loadingImagesMessage : "Download Data"}
          </button>
          <PagesDisplay pages={source.pages || []} />
        </div>
      )}
    </div>
  );
}

function sourceReducer(state: Source, action: OneSourceAction) {
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
}
