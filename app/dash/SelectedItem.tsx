import PagesDisplay from "../scrapper2/PagesDisplay";
import React, { useEffect, useState } from "react";

export default function SelectedItem({
  selectedItem,
  dispatch,
  setSelectedItem,
}: {
  selectedItem: Source;
  dispatch: React.Dispatch<SourceAction>;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [sourceUrl, setSourceUrl] = useState<string>(selectedItem.url);
  const [sourceName, setSourceName] = useState<string>(selectedItem.name);
  const [sourceFetchOption, setSourceFetchOption] = useState<string>("base");
  const [sourceId, setSourceId] = useState<string>(selectedItem._id || "");

  useEffect(() => {
    setSourceUrl(selectedItem.url);
    setSourceName(selectedItem.name);
    setSourceId(selectedItem._id || "");
  }, [selectedItem]);

  async function handleSaveSource() {
    console.log("Saving source...");
    if (sourceId === "0") {
      const response = await fetch("/api/mongo/save-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: {
            name: sourceName,
            url: sourceUrl,
            pages: selectedItem.pages,
          },
        }),
      });
      alert("Source saved!");
      const data = await response.json();
      setSourceId(data.insertedId);
      console.log("Response:", data);
      dispatch({ type: "remove", payload: "0" });
      dispatch({
        type: "add",
        payload: {
          _id: data.insertedId,
          name: sourceName,
          url: sourceUrl,
          pages: selectedItem.pages,
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
            _id: sourceId,
            name: sourceName,
            url: sourceUrl,
            pages: selectedItem.pages,
          },
        }),
      });
      alert("Source updated!");
      const data = await response.json();
      console.log("Response:", data);
      dispatch({
        type: "update",
        payload: {
          _id: sourceId,
          name: sourceName,
          url: sourceUrl,
          pages: selectedItem.pages,
        },
      });
      setSelectedItem(sourceId);
    }
  }

  return (
    <div>
      {selectedItem && (
        <div>
          <div>Name: {selectedItem.name}</div>
          <div>URL: {selectedItem.url}</div>

          <div>Source Id: {sourceId}</div>
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
          <button onClick={handleSaveSource}>Save Source</button>
          <PagesDisplay pages={selectedItem?.pages || []} />
        </div>
      )}
    </div>
  );
}
