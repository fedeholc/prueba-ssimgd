/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import Link from "next/link";
import EmojiSpinnerButton from "./ButtonEmojiSpinner";
 
export default function Home() {
  const handleButtonClick = async (): Promise<void> => {
    // Simula una acción asíncrona
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

 
  return (
    <div className={styles.page}>
      <div>
        {" "}
        Dashboard <Link href="/dash">Dash</Link>{" "}
  
        <EmojiSpinnerButton
          emoji="🚀"
          label="Launch"
          loadingLabel="Launching..."
          onClick={handleButtonClick}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
         
 
      </div>
    </div>
  );
}
