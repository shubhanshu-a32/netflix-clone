import useNetworkStatus from "../hooks/useOffline";

export default function NetworkBanner({ onReconnect }) {
  const online = useNetworkStatus();

  if (!online) {
    return (
      <div className="bg-red-600 text-center py-2">
        You are offline. Showing cached content.
      </div>
    );
  }

  if (online && onReconnect) {
    onReconnect();
  }

  return (
    <div className="bg-green-600 text-center py-2">
      Online – Content updated
    </div>
  );
}
