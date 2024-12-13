import defaultStyles from "./SelectableList.module.css";

interface SelectableListProps {
  items: Source[];
  onSelectionChange: (selectedItems: string) => void;
  styles?: { [key: string]: string }; // Objeto para los estilos
  selectedItem: string | null; // Elemento seleccionado
}

function SelectableList({
  items,
  onSelectionChange,
  styles = defaultStyles,
  selectedItem,
}: SelectableListProps) {
 
  function toggleItemSelection(item: string) {
       onSelectionChange(item);
      //setSelectedItem(item);
      return;
  }

  return (
    <div>
      <h2>Lista Seleccionable</h2>
      <div className={styles.list}>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => toggleItemSelection(item._id!)}
            className={`${styles.item} ${
              selectedItem?.includes(item._id!) ? styles.selected : styles.notSelected
            }
            `}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectableList;
