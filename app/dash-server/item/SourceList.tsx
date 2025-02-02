"use client";
import defaultStyles from "./SourceList.module.css";
export default SourceList;
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelectedLayoutSegment } from "next/navigation";

interface SourceListProps {
  items: SourceListItem[];
  styles?: { [key: string]: string };
  selectedId?: string;
}

function SourceList({
  items,
  styles = defaultStyles,
  selectedId,
}: SourceListProps) {
  const router = useRouter();

  function toggleItemSelection(item: string) {
    setSelectedItem(item);
    //go to item/id page
    router.push(`/dash-server/item/${item}`);
    return;
  }

  const segment = useSelectedLayoutSegment();

  console.log("selected ", selectedId, "segment", segment);
  const [selectedItem, setSelectedItem] = useState<string | null>(
    selectedId ? selectedId : segment || null
  );

  return (
    <div>
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
    </div>
  );
}
