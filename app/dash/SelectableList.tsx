import styles from "./SelectableList.module.css";

import React, { useState, useEffect } from "react";

interface SelectableListProps {
  items: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
}

const SelectableList: React.FC<SelectableListProps> = ({ items, onSelectionChange }) => {
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
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Lista Seleccionable</h2>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => toggleItemSelection(item)}
            className={`
              p-2 
              rounded 
              cursor-pointer 
              transition-colors 
              duration-200
              ${
                selectedItems.includes(item)
                  ? styles.selected : styles.notSelected 
              }
            `}
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h3 className="font-semibold">Elementos Seleccionados:</h3>
        <p>{selectedItems.join(", ")}</p>
      </div>
    </div>
  );
};

export default SelectableList;
