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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // --- Parse body ---
  let body: { voter_token?: unknown; liked_song_ids?: unknown };
  try {
    body = await req.json();
  } catch {
    return err(400, 'Invalid JSON body');
  }

  const { voter_token, liked_song_ids } = body;

  // --- Validate voter_token ---
  if (typeof voter_token !== 'string' || voter_token.length !== 64) {
    return err(400, 'voter_token must be a 64-character hex string');
  }

  // --- Validate liked_song_ids ---
  if (!Array.isArray(liked_song_ids)) {
    return err(400, 'liked_song_ids must be an array');
  }
  if (liked_song_ids.length < 1 || liked_song_ids.length > 35) {
    return err(400, 'liked_song_ids must contain 1 to 35 elements');
  }
  for (const id of liked_song_ids) {
    if (!Number.isInteger(id) || id < 1 || id > 35) {
      return err(400, 'Each song id must be an integer between 1 and 35');
    }
  }
  if (new Set(liked_song_ids).size !== liked_song_ids.length) {
    return err(400, 'liked_song_ids must not contain duplicates');
  }

  // --- Hash IP (never stored raw — GDPR) ---
  const rawIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = await sha256hex(rawIp);

  // --- Supabase client with service_role (bypasses RLS) ---
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // --- UPSERT: один voter_token = один голос, повтор перезаписывает ---
  const { error: upsertError } = await supabase.from('votes').upsert(
    {
      voter_token,
      liked_song_ids,
      ip_hash: ipHash,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'voter_token' },
  );

  if (upsertError) {
    return err(500, upsertError.message);
  }

  return ok({ ok: true });
});
