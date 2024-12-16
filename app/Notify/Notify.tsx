import notifyStyles from "./notifyStyles.module.css";
import { useState, useCallback, useMemo } from "react";

export function useNotify() {
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

export function Notify({ state }: { state: "busy" | "done" | "error" | null }) {
  return (
    <span className={`${notifyStyles[state || ""]}`}>
      {!state && ""}
      {state === "busy" && "loading..."}
      {state === "done" && "ready..."}
      {state === "error" && "error..."}
    </span>
  );
}

export function Notify2({
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

export function useNotify2() {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
type NotifyStatus = "busy" | "done" | "error" | null;

export function Notify3({
  state,
  className,
  stylesModule = notifyStyles,
}: {
  state: { status: NotifyStatus; message?: string } | null;
  className?: string;
  stylesModule?: { [key: string]: string };
}) {
  const defaultMessages = {
    busy: "loading...",
    done: "ready!",
    error: "Error",
  };
  if (!state?.status) return null;
  return (
    <span className={`${stylesModule[state.status] || ""} ${className || ""}`}>
      {state.message || defaultMessages[state.status]}
    </span>
  );
}

export function useNotify3() {
  const [notifyState, setNotifyState] = useState<{
    status: NotifyStatus;
    message?: string;
  } | null>(null);

  const notify = {
    setBusy: (message?: string) => setNotifyState({ status: "busy", message }),
    setDone: (message?: string) => setNotifyState({ status: "done", message }),
    setError: (message?: string) =>
      setNotifyState({ status: "error", message }),
    clear: () => setNotifyState(null),
    setState: (state: { status: NotifyStatus; message?: string } | null) =>
      setNotifyState(state),
    getState: notifyState,
  };

  return { notify };
}
