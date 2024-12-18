"use client";
import React, { useState } from "react";
import styles from "./ButtonEmojiSpinner.module.css";

interface EmojiSpinnerButtonProps {
  emoji?: string;
  label?: string;
  loadingLabel?: string;
  onClick?: () => Promise<void>;
}

export default function EmojiSpinnerButton({
  emoji = "⏳", // Emoji por defecto
  label = "Click me", // Texto del botón
  loadingLabel = "Loading...", // Texto mientras carga
  onClick, // Función que se ejecuta al hacer clic
}: EmojiSpinnerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      setIsLoading(true);
      try {
        await onClick(); // Ejecuta la función pasada como prop
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      className={styles["emoji-spinner-button"]}
      onClick={handleClick}
      disabled={isLoading}
    >
      <span
        className={`${styles["emoji-icon"]} ${
          isLoading ? styles["spinning"] : ""
        }`}
      >
        {isLoading ? emoji : ""}
      </span>
      {isLoading && <span>&nbsp;&nbsp;</span>}
      {isLoading ? loadingLabel : label}
    </button>
  );
}
