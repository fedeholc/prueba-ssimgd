"use client";
import { useEffect } from "react";
import defaultStyles from "./SourceList.module.css";
export default SourceList;

interface SourceListProps {
  items: SourceListItem[];
  handleSelectionChange: (selectedItems: string) => void;
  styles?: { [key: string]: string };
  selectedItem: string | null;
}

function SourceList({
  items,
  handleSelectionChange,
  styles = defaultStyles,
  selectedItem,
}: SourceListProps) {
  function toggleItemSelection(item: string) {
    console.log("toggleItemSelection", item);
    handleSelectionChange(item);
    return;
  }

  useEffect(() => {
    console.log("SourceList  :", selectedItem);
  }, [selectedItem]);

  return (
    
    <div className={styles.list}>
      {items?.map((item, index) => (
        <div
          key={index}
          onClick={() => toggleItemSelection(item._id!)}
          className={`${styles.item} ${
            selectedItem === item._id ? styles.selected : styles.notSelected
          }
            `}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
