"use client";
import defaultStyles from "./SourcesList.module.css";
export default SourcesList;
import { useContext } from "react";
import MyContext from "../context";

interface SourcesListProps {
  items: SourceListItem[];
  handleSelectionChange: (selectedItems: string) => void;
  styles?: { [key: string]: string };
  selectedItem: string | null;
}

function SourcesList({
  items,
  handleSelectionChange: handleSelectionChange,
  styles = defaultStyles,
  selectedItem,
}: SourcesListProps) {
  function toggleItemSelection(item: string) {
    handleSelectionChange(item);
    return;
  }

  const text = useContext(MyContext);

  return (
    <div className={styles.list}>
      {text}
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
