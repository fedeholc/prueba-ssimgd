import styles from "../page.module.css";
import SourceList from "../SourceList";
import NewSourceButton from "./NewSourceButton";
import { getDatabase } from "@/app/lib/mongodb";

export default async function DashLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const database = await getDatabase();
  const coll = database.collection("series");
  const cursor = coll.find({}, { projection: { _id: 1, name: 1 } });
  const response = await cursor.toArray();

  if (!response) {
    return;
  }
  let sourceList: SourceListItem[] = JSON.parse(JSON.stringify(response));
  sourceList = sourceList.toReversed();

  return (
    <div>
      <div>dash/item/ Layout</div>
      <NewSourceButton />

      <div className={styles.grid}>
        <div>
          <h2>Series</h2>
          {/* <Notify4
              isBusy={isLoading}
              isError={error ? true : false}
              isDone={done}
              messages={{ busy: "ocupado", done: "listo" }}
            /> */}
          {sourceList?.length > 0 && (
            <SourceList items={sourceList} selectedId={id} />
          )}
        </div>
        <div>
          <h2>Selected item</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
