// src/components/providers/ToastListener.tsx
"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export function ToastListener() {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get("login_success");

    if (loginSuccess === "true") {
      hasShown.current = true;
      console.log("✅ Login success detected!");

      // Then try toast
      setTimeout(() => {
        toast.success("Login successful!", {
          duration: 5000,
          position: "top-center",
        });
      }, 500);

      // Clean up URL
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("login_success");
        window.history.replaceState({}, "", url.toString());
      }, 4000);
    }
  }, []);

  return null;
}
