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

const MIN_SESSION_AGE_MS = 60 * 1000; // 1 минута

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // --- Parse body ---
  let body: { voter_token?: unknown; liked_song_ids?: unknown; session_token?: unknown };
  try {
    body = await req.json();
  } catch {
    return err(400, 'Invalid JSON body');
  }

  const { voter_token, liked_song_ids, session_token } = body;

  // --- Validate session_token ---
  if (typeof session_token !== 'string' || session_token.length !== 64) {
    return err(400, 'session_token must be a 64-character hex string');
  }

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

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // --- Проверяем session_token ---
  const tokenHash = await sha256hex(session_token);

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('created_at, used_at')
    .eq('token_hash', tokenHash)
    .single();

  if (sessionError || !session) {
    return err(403, 'Invalid or expired session token');
  }

  if (session.used_at !== null) {
    return err(403, 'Session token already used');
  }

  const sessionAgeMs = Date.now() - new Date(session.created_at).getTime();
  if (sessionAgeMs < MIN_SESSION_AGE_MS) {
    return err(403, 'Too fast. Please take your time with the songs.');
  }

  // --- Помечаем сессию как использованную ---
  const { error: updateError } = await supabase
    .from('sessions')
    .update({ used_at: new Date().toISOString() })
    .eq('token_hash', tokenHash);

  if (updateError) {
    return err(500, updateError.message);
  }

  // --- Hash IP (never stored raw — GDPR) ---
  const rawIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = await sha256hex(rawIp);

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
