"use client";
import React from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h2>Something went wrong!</h2>
      <pre style={{ color: "#c00", margin: 16 }}>{error.message}</pre>
      <button onClick={reset} style={{ marginTop: 16, padding: "8px 16px" }}>
        Try again
      </button>
    </div>
  );
}
