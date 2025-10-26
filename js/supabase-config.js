// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://bpvjlhykxzfhhlxokizi.supabase.co', // Replace with your Supabase URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdmpsaHlreHpmaGhseG9raXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MjI1NDgsImV4cCI6MjA3Njk5ODU0OH0.C-q8ew1QEsKyp4ojVOAgBRpZZabiiIB3daw0_D9TcAs' // Replace with your Supabase anon key
};

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Export for use in other files
window.supabaseClient = supabase;