import defaultStyles from "./SelectableList.module.css";

import React, { useState, useEffect } from "react";

interface SelectableListProps {
  items: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
  styles?: { [key: string]: string }; // Objeto para los estilos
}

function SelectableList({ items, onSelectionChange, styles = defaultStyles }: SelectableListProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

   
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  const toggleItemSelection = (item: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selectedItem) => selectedItem !== item)
        : [...prevSelected, item]
    );
  };

  return (
    <div>
      <h2>Lista Seleccionable</h2>
      <div>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => toggleItemSelection(item)}
            className={`${styles.item} ${
              selectedItems.includes(item)
                ? styles.selected
                : styles.notSelected
            }
            `}
          >
            {item}
          </div>
        ))}
      </div>
      <div>
        <h3>Elementos Seleccionados:</h3>
        <p>{selectedItems.join(", ")}</p>
      </div>
    </div>
  );
}

export default SelectableList;
