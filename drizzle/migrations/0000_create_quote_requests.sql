CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 100),
  office text NOT NULL CHECK (char_length(btrim(office)) BETWEEN 2 AND 120),
  model text NOT NULL CHECK (model IN ('Site Essencial', 'Site Profissional')),
  contact text NOT NULL CHECK (char_length(btrim(contact)) BETWEEN 8 AND 254)
);
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;