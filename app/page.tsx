/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import Link from "next/link";
import EmojiSpinnerButton from "./ButtonEmojiSpinner";
import { useState } from "react";

function useNotify() {
  const [notifyState, setNotifyState] = useState<
    "busy" | "done" | "error" | null
  >(null);

  const notify = {
    setBusy: () => setNotifyState("busy"),
    setDone: () => setNotifyState("done"),
    setError: () => setNotifyState("error"),
    getState: notifyState,
  };
  return { notify };
}

export default function Home() {
  const handleButtonClick = async (): Promise<void> => {
    // Simula una acción asíncrona
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const { notify } = useNotify();

  const [notifyState, setNotifyState] = useState<
    "busy" | "done" | "error" | null
  >(null);

  return (
    <div className={styles.page}>
      <div>
        {" "}
        Dashboard <Link href="/dash">Dash</Link>{" "}
        <Notify state={notify.getState} />
        <EmojiSpinnerButton
          emoji="🚀"
          label="Launch"
          loadingLabel="Launching..."
          onClick={handleButtonClick}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          onClick={() => {
            notify.setBusy();
            setTimeout(() => notify.setDone(), 2000);
          }}
        >
          aaa
        </button>
        <Notify state={notifyState} />
      </div>
    </div>
  );
}

function Notify({ state }: { state: "busy" | "done" | "error" | null }) {
  return (
    <span className={`${styles[state || ""]}`}>
      {!state && ""}
      {state === "busy" && "loading..."}
      {state === "done" && "ready..."}
    </span>
  );
}
