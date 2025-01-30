"use client";
import { useRouter } from "next/navigation";
export default function NewSourceButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.push("/dash-server/item/new")}>
      New source
    </button>
  );
}
