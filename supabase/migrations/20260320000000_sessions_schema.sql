-- ============================================================
-- Europesenken — sessions schema
-- Gate-таблица для anti-abuse: токен создаётся перед свайпами,
-- submit-vote проверяет что с момента создания прошло >= 1 мин.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sessions (
  token_hash  text          PRIMARY KEY,           -- SHA256(session_token)
  ip_hash     text          NOT NULL,              -- SHA256(IP), GDPR
  created_at  timestamptz   NOT NULL DEFAULT now(),
  used_at     timestamptz   NULL                   -- NULL = не использован
);

COMMENT ON TABLE public.sessions IS
  'Одноразовые сессии для gate-проверки submit-vote. token_hash = SHA256(random token).';

-- Для rate-limit запроса: сколько токенов с этого IP за 5 часов
CREATE INDEX IF NOT EXISTS idx_sessions_ip_hash_created
  ON public.sessions (ip_hash, created_at);

-- Для TTL-уборки устаревших сессий
CREATE INDEX IF NOT EXISTS idx_sessions_created_at
  ON public.sessions (created_at);

-- RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Клиент вообще не должен трогать sessions напрямую
DROP POLICY IF EXISTS "Deny all direct access" ON public.sessions;
CREATE POLICY "Deny all direct access" ON public.sessions
  FOR ALL USING (false);
