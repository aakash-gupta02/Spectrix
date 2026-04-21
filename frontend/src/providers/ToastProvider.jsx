"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a1a1a",
          color: "#e5e7eb",
          border: "1px solid #404040",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#1a1a1a",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#1a1a1a",
          },
        },
      }}
    />
  );
}
