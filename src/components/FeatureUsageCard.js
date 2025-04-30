// src/components/FeatureUsageCard.js
import React, { useState, useEffect } from "react";
import axios from "../axios";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
} from "recharts";

export default function FeatureUsageCard({ accessToken }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [error, setErr] = useState("");

  useEffect(() => {
    if (!open || data) return;            
    (async () => {
      try {
        const res = await axios.get("/api/admin/featureStats", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        // reshape for recharts
        const chart = res.data.data.map(d => ({
          name: pretty(d.feature),
          Users: d.uniqueUsers,
          "Median min": (d.medianMs/60000).toFixed(1),
        }));
        setData(chart);
      } catch (e) {
        setErr("Failed to load feature stats");
      }
    })();
  }, [open, data, accessToken]);

  const pretty = f => {
    switch (f) {
      case "faq":          return "FAQs";
      case "trends":       return "Trends";
      case "assist":       return "G-Fit Assist";
      case "pwa_install":  return "Add-To-Home";
      default:             return f;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-6">
      <div className="p-6 flex justify-between items-center cursor-pointer"
           onClick={() => setOpen(!open)}>
        <h3 className="text-xl font-semibold">
          Major-Feature Adoption (last 30 d)
        </h3>
        <div className="text-4xl font-bold">{open ? "−" : "+"}</div>
      </div>

      {open && (
        <div className="p-6 border-t border-gray-200">
          {error && <p className="text-red-500">{error}</p>}
          {!data && !error && <p>Loading…</p>}

          {data && (
            <>
              {/* Bar chart – Users per feature */}
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Users" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>

              {/* Median session time table */}
              <table className="table-auto w-full text-sm mt-4">
                <thead className="bg-gray-100"><tr>
                  <th className="p-2">Feature</th>
                  <th className="p-2 text-right">Median time (min)</th>
                </tr></thead>
                <tbody>
                  {data.map((d,i)=>(
                    <tr key={i} className="border-t">
                      <td className="p-2">{d.name}</td>
                      <td className="p-2 text-right">{d["Median min"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
