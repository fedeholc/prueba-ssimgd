import { ContextProvider } from "../../context";
import styles from "../page.module.css";
import SourcesList2 from "../SourcesList2";

export default async function Dash({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(
    "http://localhost:3000/api/mongo/get-sources-list"
  );

  if (!response.ok) {
    return;
  }
  const sourceList = await response.json();
  return (
    <div>
      <ContextProvider>
        <div>dash/item/ page</div>

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
            <h2>Select an item</h2>
          </div>
        </div>
      </ContextProvider>
    </div>
  );
}
