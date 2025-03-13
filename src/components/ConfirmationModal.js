// ConfirmationModal.js
import React from "react";
import "../css/ConfirmationModal.css"; // styling for your overlay, etc.

export default function ConfirmationModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!visible) return null; // Don't render if not visible

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-buttons">
          <button className="yes-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
