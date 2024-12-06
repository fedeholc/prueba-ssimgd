import styles from "./SelectableList.module.css";

import React, { useState, useEffect } from "react";

interface SelectableListProps {
  items: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
}

const SelectableList: React.FC<SelectableListProps> = ({
  items,
  onSelectionChange,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Efecto para notificar cambios en la selección
  useEffect(() => {
    // Llamamos al callback con los elementos seleccionados
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
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => toggleItemSelection(item)}
            className={`${
              selectedItems.includes(item)
                ? styles.selected
                : styles.notSelected
            }
            `}
          >
            {item}
          </li>
        ))}
      </ul>
      <div>
        <h3>Elementos Seleccionados:</h3>
        <p>{selectedItems.join(", ")}</p>
      </div>
    </div>
  );
};

export default SelectableList;
