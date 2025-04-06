import { createClient } from '@supabase/supabase-js';

// Nustatyk savo Supabase URL ir anoniminį raktą
const supabaseUrl = 'https://evtusmqxvbbxywnyrqln.supabase.co'; // Pakeisk į savo Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dHVzbXF4dmJieHl3bnlycWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDMyNjUsImV4cCI6MjA1OTAxOTI2NX0.gpx1XSkFOIqTLEb9dBnlJDvAWaCkiONYJANHfpeSR5g'; // Pakeisk į savo anoniminį raktą

// Sukuriame supabase klientą
export const supabase = createClient(supabaseUrl, supabaseAnonKey);