import { useState, useEffect } from "react";
import useNetworkStatus from "../hooks/useOffline";
import { syncOfflineData } from "../api/tvShowsApi";

export default function NetworkBanner() {
  const [syncing, setSyncing] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const handleReconnect = async () => {
    setSyncing(true);
    setShowBanner(true);

    await syncOfflineData();

    setSyncing(false);

    setTimeout(() => {
      setShowBanner(false);
    }, 3000);
  };

  const { isOnline, wasOffline } = useNetworkStatus(handleReconnect);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    }
  }, [isOnline]);

  if (isOnline && !wasOffline && !syncing && !showBanner) {
    return null;
  }

  if (!isOnline) {
    return (
      <div className="bg-red-600 text-white text-center py-2 px-4 flex items-center justify-center gap-2 transition-all duration-300">
        <span className="text-xl">📡</span>
        <span className="font-medium">You are offline. Showing cached content.</span>
      </div>
    );
  }

  if (showBanner && (wasOffline || syncing)) {
    return (
      <div className="bg-green-600 text-white text-center py-2 px-4 flex items-center justify-center gap-2 transition-all duration-300">
        <span className="text-xl animate-spin">🔄</span>
        <span className="font-medium">
          {syncing ? 'Back Online - Syncing...' : 'Content Updated'}
        </span>
      </div>
    );
  }

  return null;
}
