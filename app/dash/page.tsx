"use client";
import styles from "./page.module.css";
import SeriesList from "./SeriesList";

export default function Dash() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Dashboard content</p>
      <div className={styles.grid}>
        <div
          onClick={(e: React.MouseEvent) => {
            console.log((e.target as HTMLElement).dataset.prueba);
          }}
        >
          <h2>Series</h2>
          <SeriesList />
        </div>
        <div>
          <h2>Data</h2>
        </div>
      </div>
    </div>
  );
}
