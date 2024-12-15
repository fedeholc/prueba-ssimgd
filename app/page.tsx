/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import notifyStyles from "./notifyStyles.module.css";
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

function useNotify2() {
  const [notifyState, setNotifyState] = useState<{
    status: string;
    message?: string;
  } | null>(null);

  const notify = {
    setBusy: () => setNotifyState({ status: "busy", message: "loading..." }),
    setDone: () => setNotifyState({ status: "done", message: "ready..." }),
    setError: () => setNotifyState({ status: "error", message: "error..." }),
    clear: () => setNotifyState(null),
    setState: (state: { status: string; message?: string }) =>
      setNotifyState(state),
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
  const { notify: notify2 } = useNotify2();

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
            notify2.setBusy();
            setTimeout(() => {
              notify.setDone();
              notify2.setDone();
            }, 2000);
          }}
        >
          aaa
        </button>
        <Notify2 state={notify2.getState} />
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
      {state === "error" && "error..."}
    </span>
  );
}

function Notify2({
  state,
  className,
  style,
  stylesModule = notifyStyles,
}: {
  state: { status: string; message?: string } | null;
  className?: string;
  style?: React.CSSProperties;
  stylesModule?: { [key: string]: string };
}) {
  if (!state) return null;
  return (
    <span
      className={`${stylesModule[state.status] || ""} ${className || ""}`}
      style={style}
    >
      {state.message}
    </span>
  );
}
