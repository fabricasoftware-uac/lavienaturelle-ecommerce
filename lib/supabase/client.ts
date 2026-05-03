// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let browserClient: any = null;

export const createClient = () => {
  // 1. Si estamos en el servidor, crear una instancia nueva (normal en Next.js)
  if (typeof window === "undefined") {
    return createBrowserClient(supabaseUrl!, supabaseKey!);
  }

  // 2. Si ya existe una instancia en el navegador, reusarla
  if (browserClient) return browserClient;

  // 3. Crear la instancia única para el navegador
  browserClient = createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
    {
      auth: {
        // Esto ayuda a mitigar problemas de bloqueos en desarrollo local
        flowType: 'pkce',
        persistSession: true,
        detectSessionInUrl: true,
      }
    }
  );
  
  return browserClient;
};
