import { ContextProvider } from "../context";
import Dash1 from "./dash1";
import styles from "./page.module.css";
import SourcesList2 from "./SourcesList2";
 

export default async function DashLayout ( {children}: Readonly<{children: React.ReactNode}> ) {
  const response = await fetch(
    "http://localhost:3000/api/mongo/get-sources-list"
  );
  console.log(response);
  if (!response.ok) {
    return;
  }
  const sourceList = await response.json();
  return (
    <div>
      <ContextProvider>
        <h1>Dashboard Layout</h1>

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
              <SourcesList2
                items={sourceList}
                  
              />
            )}
          </div>
          <div>
            <h2>Selected item</h2>
             {children}
            {/*  <SelectedSource
              selectedItem={selecteditem}
              sourceDispatch={sourceListDispatch}
              setSelectedItem={setSelectedItem}
            /> */}
          </div>
        </div>
      </ContextProvider>
    </div>
  );
}