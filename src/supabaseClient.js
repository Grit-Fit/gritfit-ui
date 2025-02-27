// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Make sure your .env variables for the frontend start with REACT_APP_
// You can rename them in the .env file if needed.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://okuesfaclmrcqpgugvan.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdWVzZmFjbG1yY3FwZ3VndmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3MTg4ODYsImV4cCI6MjA0NDI5NDg4Nn0.rHA31j0j4XkSBH_hfabYK64cyYtlbQ8AtQrleW0crk4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
