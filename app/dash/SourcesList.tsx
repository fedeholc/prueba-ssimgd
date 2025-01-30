"use client";
import defaultStyles from "./SourcesList.module.css";
export default SourcesList;

interface SourcesListProps {
  items: SourceListItem[];
  handleSelectionChange: (selectedItems: string) => void;
  styles?: { [key: string]: string };
  selectedItem: string | null;
}

function SourcesList({
  items,
  handleSelectionChange,
  styles = defaultStyles,
  selectedItem,
}: SourcesListProps) {
  function toggleItemSelection(item: string) {
    handleSelectionChange(item);
    return;
  }

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
