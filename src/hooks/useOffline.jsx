import { useEffect, useState, useRef } from "react";

export default function useNetworkStatus(onReconnect) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const previousOnlineState = useRef(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Network: ONLINE');
      setIsOnline(true);

      if (!previousOnlineState.current) {
        setWasOffline(true);

        if (onReconnect) {
          console.log('🔄 Triggering reconnect callback...');
          onReconnect();
        }

        setTimeout(() => setWasOffline(false), 3000);
      }

      previousOnlineState.current = true;
    };

    const handleOffline = () => {
      console.log('📡 Network: OFFLINE');
      setIsOnline(false);
      previousOnlineState.current = false;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onReconnect]);

  return { isOnline, wasOffline };
}
