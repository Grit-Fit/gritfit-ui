import React, { useState, useContext } from "react";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";

export default function FeedbackPrompt({ feature, question, placeholder, onClose, onSubmitted }) {
  const { accessToken, refreshAuthToken } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) { alert("Please select a rating."); return; }
  
    if (!accessToken) {
      await refreshAuthToken?.();
      if (!accessToken) {
        alert("Session expired – please log in again.");
        onClose();
        return;
      }
    }
  
    setSubmitting(true);
    try {
      await axios.post("/api/feedback",
        { feature, rating, comment },
        { headers: { Authorization:`Bearer ${accessToken}` } }
      );
      onSubmitted?.(); 
      alert("Thanks for the feedback!");
  
      // 🛠️ Fix mobile zoom/pan issue globally here:
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.body.style.zoom = "100%";
      }, 100);
  
      onClose();
    } catch (err) {
      console.error("feedback error:", err);
      alert("Could not save feedback.");
      setSubmitting(false);
    }
  };

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
        <h3 className="text-lg font-semibold mb-4">{question}</h3>

        {/* simple 1‑5 stars */}
        <div className="flex justify-center mb-4 space-x-2">
          {[1,2,3,4,5].map(n=>(
            <button key={n}
              className={`text-2xl ${rating>=n?"text-yellow-400":"text-gray-300"}`}
              onClick={()=>setRating(n)}
              disabled={submitting}>
              ★
            </button>
          ))}
        </div>

        <textarea
          className="w-full border rounded p-2 text-sm mb-4"
          rows={3} placeholder={placeholder}
          value={comment} onChange={e=>setComment(e.target.value)}
          disabled={submitting}
          style={{fontSize: "16px"}}
        />

        <div className="flex justify-between">
          {/* <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose} disabled={submitting}>
            Cancel
          </button> */}
          <button
            className="px-4 py-2 bg-black text-white rounded"
            onClick={handleSubmit} disabled={submitting} style={{marginRight: "auto", marginLeft:"auto"}}>
            {submitting ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
