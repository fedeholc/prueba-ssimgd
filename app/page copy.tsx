/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import Link from "next/link";
import EmojiSpinnerButton from "./ButtonEmojiSpinner";
import { useState } from "react";

function useNotify() {
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
            notify.setState({ status: "busy", message: "loading..." });
            setTimeout(() => notify.setState({ status: "done", message: "ready..." }), 2000);
          }}
        >
          aaa
        </button>
       </div>
    </div>
  );
}

function Notify({
  state,
  className,
  style,
}: {
  state: { status: string; message?: string } | null;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!state) return null;
  return (
    <span className={`${styles[state.status] || ""} ${className || ""}`} style={style}>
      {state.message}
    </span>
  );
}
