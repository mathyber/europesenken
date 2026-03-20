import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function ok(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function err(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function sha256hex(input: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_HOURS = 5;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rawIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = await sha256hex(rawIp);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // --- Rate limit: макс RATE_LIMIT_MAX токенов с одного IP за RATE_LIMIT_WINDOW_HOURS часов ---
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000,
  ).toISOString();

  const { count, error: countError } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', windowStart);

  if (countError) {
    return err(500, countError.message);
  }

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return err(429, 'Too many sessions created from this IP. Try again later.');
  }

  // --- Генерим случайный токен ---
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const sessionToken = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const tokenHash = await sha256hex(sessionToken);

  // --- Сохраняем в sessions ---
  const { error: insertError } = await supabase.from('sessions').insert({
    token_hash: tokenHash,
    ip_hash: ipHash,
  });

  if (insertError) {
    return err(500, insertError.message);
  }

  return ok({ session_token: sessionToken });
});
