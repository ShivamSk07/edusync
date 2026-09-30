import { useEffect, useState } from "react";

export type ConnectivityState = "online" | "offline";

/** Reports real browser connectivity. Sync states are added in the offline phase. */
export function useConnectivity() {
  const [status, setStatus] = useState<ConnectivityState>("online");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const update = () => setStatus(navigator.onLine ? "online" : "offline");
    update();
    setHydrated(true);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return { status, hydrated };
}
