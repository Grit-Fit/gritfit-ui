import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RatingChart({ counts }) {
  /* counts = {1:2, 2:0, 3:4, 4:10, 5:8} */
  const data = [1,2,3,4,5].map(n => ({ name: n.toString(), value: counts[n] || 0 }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top:10, right:30, left:0, bottom:0 }}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false}/>
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  );
}
