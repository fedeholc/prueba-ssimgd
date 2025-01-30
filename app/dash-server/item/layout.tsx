import { ContextProvider } from "../../context";
import styles from "../page.module.css";
import SourcesList2 from "../SourcesList2";
import NewSourceButton from "./NewSourceButton";

export default async function DashLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  //TODO: podría no usar la api y hacer directanente la consulta a la base
  const response = await fetch(
    "http://localhost:3000/api/mongo/get-sources-list"
  );

  if (!response.ok) {
    return;
  }
  let sourceList: Source[] = await response.json();
  sourceList = sourceList.toReversed();

  return (
    <div>
      <ContextProvider>
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
              <SourcesList2 items={sourceList} selectedId={id} />
            )}
          </div>
          <div>
            <h2>Selected item</h2>
            {children}
          </div>
        </div>
      </ContextProvider>
    </div>
  );
}
