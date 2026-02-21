"use client";
import { useEffect } from "react";

export default function useSyncSessionToDB(oauthId: string | null) {
  useEffect(() => {
    if (!oauthId) return;

    const sessionData = sessionStorage.getItem("inputDataBeforeLogin");
    if (!sessionData) return;

    fetch("/api/syncSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oauthId, sessionData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.removeItem("inputDataBeforeLogin");
        }
      })
      .catch(console.error);
  }, [oauthId]);
}
