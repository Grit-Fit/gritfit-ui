import { useState } from "react";

const RefreshButton = () => {
  const [refreshing, setRefreshing] = useState(false);

  const clearCacheAndReload = () => {
    setRefreshing(true);
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  };

  return (
    <button
      onClick={clearCacheAndReload}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 24px",
        border: "2px solid #007bff",
        background: "transparent",
        color: "#007bff",
        borderRadius: "32px",
        fontSize: "10px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        marginTop: "20px"
      }}
    >
      🔄 Refresh App
    </button>
  );
};

export default RefreshButton;
