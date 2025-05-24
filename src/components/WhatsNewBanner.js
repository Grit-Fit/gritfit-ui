
import React, { useEffect, useRef } from "react";

export default function WhatsNewBanner({ onClose, children }) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingTop: 50,
      zIndex: 2000
    }}>
      <div ref={ref} style={{
        background: "linear-gradient(270deg, #13D7E9FF 0%, #98EB24FF 100%)",
        borderRadius: 8,
        padding: 20,
        maxWidth: "100%",
        marginTop: "auto",
        marginBottom: "26rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
      }}>
        {children}
      </div>
    </div>
  );
}
