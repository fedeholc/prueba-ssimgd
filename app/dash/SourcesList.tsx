import defaultStyles from "./SourcesList.module.css";

interface SourcesListProps {
  items: SourceListItem[];
  handleSelectionChange: (selectedItems: string) => void;
  styles?: { [key: string]: string }; // Objeto para los estilos
  selectedItem: string | null; // Elemento seleccionado
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

  console.log("selectable list items: ", items);
  return (
    <div className={styles.list}>
      {items.map((item, index) => (
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

export default SourcesList;
