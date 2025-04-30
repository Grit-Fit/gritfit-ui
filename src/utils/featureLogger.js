
import { supabase } from "../supabaseClient";   

const sessions = {};   


export function markFeatureOpen(feature) {
  sessions[feature] = Date.now();
}


export async function markFeatureClose(feature, userId) {
  const start = sessions[feature];
  if (!start) return;                      

  const duration = Date.now() - start;
  delete sessions[feature];                 

  await supabase.from("feature_events").insert({
    userid: userId,
    feature,
    started_at: new Date(start).toISOString(),
    duration_ms: duration
  });
}
