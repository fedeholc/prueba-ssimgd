"use client";
import defaultStyles from "./SourcesList.module.css";
export default SourcesList2;
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SourcesListProps {
  items: SourceListItem[];
  styles?: { [key: string]: string };
}

function SourcesList2({ items, styles = defaultStyles }: SourcesListProps) {
  const router = useRouter();
  function toggleItemSelection(item: string) {
    setSelectedItem(item);
    //go to item/id page
    router.push(`/dash-server/item/${item}`);
    return;
  }
  const [selectedItem, setSelectedItem] = useState<string | null>(
    items[0]?._id
  ); //poner en null si no se quiere iniciar con un item seleccionado

  //para que seleccione el primer item cuando se cargue por primera vez
  useEffect(() => {
    if (selectedItem) {
      router.push(`/dash-server/item/${selectedItem}`);
    }
  });
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
