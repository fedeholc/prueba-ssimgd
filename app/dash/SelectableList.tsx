import defaultStyles from "./SelectableList.module.css";

import React, { useState, useEffect } from "react";

interface SelectableListProps {
  items: string[];
  onSelectionChange?: (selectedItems: string) => void;
  styles?: { [key: string]: string }; // Objeto para los estilos
  mode?: "single" | "multiple"; // Modo de selección
  selectedItem: string | null; // Elemento seleccionado
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

function SelectableList({
  items,
  onSelectionChange,
  styles = defaultStyles,
  mode = "single",
  selectedItem,
  setSelectedItem
}: SelectableListProps) {
 
  function toggleItemSelection(item: string) {
    if (mode === "single") {
      setSelectedItem(item);
      return;
    }
  }

  return (
    <div>
      <h2>Lista Seleccionable</h2>
      <div className={styles.list}>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => toggleItemSelection(item)}
            className={`${styles.item} ${
              selectedItem?.includes(item) ? styles.selected : styles.notSelected
            }
            `}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectableList;
