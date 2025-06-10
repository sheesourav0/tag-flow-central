
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

const SUPABASE_URL = "https://lpshbfkwtnbvqxikamsr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwc2hiZmt3dG5idnF4aWthbXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjYzMTQsImV4cCI6MjA2NDQ0MjMxNH0.9uATh-avjAcuEy0qdb7oRefIf5zTW6AsCRgWZeZAeS0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
