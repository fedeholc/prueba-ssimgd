/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <div>
        {" "}
        Dashboard <Link href="/dash-spa">Dash spa</Link>{" "}
      </div>
      <div>
        {" "}
        Dashboard <Link href="/dash-server/item">Dash server components</Link>{" "}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}></div>
    </div>
  );
}
