// src/components/SupportButton.js
import React, { useState } from "react";
import axios from "../axios";
import { LifeBuoy } from "lucide-react";
import DOMPurify from "dompurify";

export default function SupportButton({ token }) {
  const [open, setOpen]       = useState(false);
  const [subject, setSubject] = useState("");
  const [msg, setMsg]         = useState("");
  const [busy, setBusy]       = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const sanitize = (s) => DOMPurify.sanitize(s);

  async function submit() {
    if (!token) return setError("Please log in first.");
    if (!subject.trim() || !msg.trim()) {
      return setError("Both fields are required.");
    }
    setBusy(true); setError("");
    try {
      await axios.post(
        "/api/supportTicket",
        { subject: sanitize(subject.trim()), description: sanitize(msg.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSent(true);
      setSubject(""); setMsg("");
    } catch (e) {
      console.error(e);
      setError("Failed – please try again.");
    } finally {
      setBusy(false);
    }
  }

  const modal = (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.55)",
      display:"flex", justifyContent:"center", alignItems:"center", zIndex:10000
    }}>
      <div style={{
        background:"#fff", borderRadius:12, padding:24, width:"90%", maxWidth:420,
        boxShadow:"0 6px 18px rgba(0,0,0,.35)"
      }}>
        {sent ? (
          <>
            <h3 style={{marginTop:0}}>Thank you!</h3>
            <p>We’ve logged your message. Check your email for the ticket ID.</p>
            <button onClick={()=>{ setSent(false); setOpen(false); }}>Close</button>
          </>
        ) : (
          <>
            <h3 style={{marginTop:0}}>Need Help?</h3>
            <input
              value={subject}
              onChange={e=>setSubject(e.target.value)}
              placeholder="Subject"
              maxLength={120}
              style={{width:"100%", margin:"8px 0", padding:8, borderRadius:6, border:"1px solid #ccc"}}
            />
            <textarea
              value={msg}
              onChange={e=>setMsg(e.target.value)}
              placeholder="Describe the issue…"
              rows={5}
              maxLength={2000}
              style={{width:"100%", padding:8, borderRadius:6, border:"1px solid #ccc"}}
            />
            {error && <p style={{color:"red",marginTop:6}}>{error}</p>}

            <div style={{textAlign:"right", marginTop:12}}>
              <button onClick={()=>setOpen(false)} style={{marginRight:8}}>Cancel</button>
              <button onClick={submit} disabled={busy}>
                {busy ? "Sending…" : "Send"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* floating icon */}
      <div
        onClick={()=>setOpen(true)}
        style={{
          position:"fixed", bottom:90, right:24, zIndex:9999,
          width:58, height:58, borderRadius:"50%", background:"#00bcd4",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 3px 8px rgba(0,0,0,.3)", cursor:"pointer"
        }}>
        <LifeBuoy size={26} color="#fff" />
      </div>

      {open && modal}
    </>
  );
}
