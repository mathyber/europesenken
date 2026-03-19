-- ============================================================
-- Europesenken — votes schema
-- Выполнить в Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ------------------------------------------------------------
-- Таблица votes: анонимные голоса пользователей
-- voter_token = SHA256(localStorage UUID + FingerprintJS visitorId)
-- ip_hash     = SHA256(IP) — вычисляется в Edge Function submit-vote
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.votes (
  voter_token    text          PRIMARY KEY,
  liked_song_ids integer[]     NOT NULL,
  ip_hash        text          NOT NULL,
  created_at     timestamptz   NOT NULL DEFAULT now(),
  updated_at     timestamptz   NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.votes IS
  'Анонимные голоса. voter_token = SHA256(UUID + fingerprint). ip_hash = SHA256(IP) из Edge Function.';
COMMENT ON COLUMN public.votes.voter_token IS
  'SHA256 hex(64 символа) от конкатенации localStorage UUID и FingerprintJS visitorId.';
COMMENT ON COLUMN public.votes.liked_song_ids IS
  'Массив ID лайкнутых песен (1–35). Соответствуют songsArray в src/constants/songs.tsx.';
COMMENT ON COLUMN public.votes.ip_hash IS
  'SHA256 от IP-адреса. Сам IP не хранится (GDPR).';

-- ------------------------------------------------------------
-- Индексы
-- ------------------------------------------------------------

-- Поиск по IP: антинакрутка (другой токен с того же IP за последний час)
CREATE INDEX IF NOT EXISTS idx_votes_ip_hash
  ON public.votes (ip_hash);

-- Фильтрация по дате обновления (WHERE updated_at >= now() - interval '1 hour')
CREATE INDEX IF NOT EXISTS idx_votes_updated_at
  ON public.votes (updated_at);

-- ------------------------------------------------------------
-- Constraint: liked_song_ids содержит только валидные ID 1–35
-- ------------------------------------------------------------
ALTER TABLE public.votes
  DROP CONSTRAINT IF EXISTS chk_song_ids;

ALTER TABLE public.votes
  ADD CONSTRAINT chk_song_ids CHECK (
    array_length(liked_song_ids, 1) BETWEEN 1 AND 35
    AND liked_song_ids <@ ARRAY[
      1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
      19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35
    ]
  );

-- ------------------------------------------------------------
-- Row Level Security
-- Все записи идут через Edge Function (service_role обходит RLS)
-- ------------------------------------------------------------
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Публичное чтение — для скорборда и подсчёта total_voters
DROP POLICY IF EXISTS "Allow public read" ON public.votes;
CREATE POLICY "Allow public read" ON public.votes
  FOR SELECT USING (true);

-- Прямая вставка с клиента запрещена
DROP POLICY IF EXISTS "Deny direct insert" ON public.votes;
CREATE POLICY "Deny direct insert" ON public.votes
  FOR INSERT WITH CHECK (false);

-- Прямое обновление с клиента запрещено
DROP POLICY IF EXISTS "Deny direct update" ON public.votes;
CREATE POLICY "Deny direct update" ON public.votes
  FOR UPDATE USING (false);

-- Прямое удаление с клиента запрещено
DROP POLICY IF EXISTS "Deny direct delete" ON public.votes;
CREATE POLICY "Deny direct delete" ON public.votes
  FOR DELETE USING (false);

-- ------------------------------------------------------------
-- View scoreboard: агрегация лайков по song_id
-- Используется: supabase.from('scoreboard').select('*')
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW public.scoreboard AS
SELECT
  s.song_id,
  COUNT(*)::integer AS likes_count,
  ROUND(
    COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM public.votes), 0),
    1
  ) AS percentage
FROM public.votes v, UNNEST(v.liked_song_ids) AS s(song_id)
GROUP BY s.song_id
ORDER BY likes_count DESC;

COMMENT ON VIEW public.scoreboard IS
  'Агрегированный рейтинг. UNNEST разворачивает liked_song_ids в строки, COUNT группирует по song_id.';
