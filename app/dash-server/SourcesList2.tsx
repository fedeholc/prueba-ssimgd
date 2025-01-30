"use client";
import defaultStyles from "./SourcesList.module.css";
export default SourcesList2;
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelectedLayoutSegment } from "next/navigation";
 
interface SourcesListProps {
  items: SourceListItem[];
  styles?: { [key: string]: string };
  selectedId?: string;
}

function SourcesList2({
  items,
  styles = defaultStyles,
  selectedId,
}: SourcesListProps) {
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
      Segment: {segment}
    
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
