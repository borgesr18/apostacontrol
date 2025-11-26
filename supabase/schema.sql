-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    time_zone TEXT DEFAULT 'America/Recife',
    currency TEXT DEFAULT 'BRL',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BANCAS
CREATE TABLE public.bancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    moeda TEXT NOT NULL DEFAULT 'BRL',
    saldo_inicial NUMERIC(14,2) NOT NULL,
    saldo_atual NUMERIC(14,2) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BANCAS MOVIMENTACOES
CREATE TABLE public.bancas_movimentacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    banca_id UUID NOT NULL REFERENCES public.bancas(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('deposito', 'saque', 'ajuste', 'transferencia')),
    valor NUMERIC(14,2) NOT NULL,
    data_movimentacao DATE NOT NULL,
    banca_origem_id UUID REFERENCES public.bancas(id),
    banca_destino_id UUID REFERENCES public.bancas(id),
    observacao TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CASAS DE APOSTAS
CREATE TABLE public.casas_apostas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    site TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ESTRATEGIAS
CREATE TABLE public.estrategias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    parametros JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. APOSTAS (Simples)
CREATE TABLE public.apostas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    banca_id UUID NOT NULL REFERENCES public.bancas(id) ON DELETE CASCADE,
    casa_aposta_id UUID REFERENCES public.casas_apostas(id) ON DELETE SET NULL,
    estrategia_id UUID REFERENCES public.estrategias(id) ON DELETE SET NULL,
    data_evento TIMESTAMPTZ NOT NULL,
    data_aposta TIMESTAMPTZ NOT NULL DEFAULT now(),
    esporte TEXT NOT NULL DEFAULT 'Futebol',
    liga TEXT,
    time_casa TEXT,
    time_fora TEXT,
    mercado TEXT NOT NULL,
    tipo_aposta TEXT NOT NULL DEFAULT 'simples',
    selecao TEXT NOT NULL,
    odd NUMERIC(10,3) NOT NULL,
    stake NUMERIC(14,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'ganha', 'perdida', 'devolvida', 'meia-ganha', 'meia-perdida', 'cancelada')),
    retorno_bruto NUMERIC(14,2),
    lucro NUMERIC(14,2),
    resultado_jogo TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. BILHETES (Múltiplas)
CREATE TABLE public.bilhetes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    banca_id UUID NOT NULL REFERENCES public.bancas(id) ON DELETE CASCADE,
    casa_aposta_id UUID REFERENCES public.casas_apostas(id) ON DELETE SET NULL,
    estrategia_id UUID REFERENCES public.estrategias(id) ON DELETE SET NULL,
    data_aposta TIMESTAMPTZ NOT NULL DEFAULT now(),
    tipo TEXT NOT NULL DEFAULT 'multipla',
    odd_total NUMERIC(10,3) NOT NULL,
    stake NUMERIC(14,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'ganho', 'perdido', 'devolvido', 'parcial')),
    retorno_bruto NUMERIC(14,2),
    lucro NUMERIC(14,2),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. BILHETE SELECOES
CREATE TABLE public.bilhete_selecoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bilhete_id UUID NOT NULL REFERENCES public.bilhetes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    data_evento TIMESTAMPTZ NOT NULL,
    esporte TEXT NOT NULL DEFAULT 'Futebol',
    liga TEXT,
    time_casa TEXT,
    time_fora TEXT,
    mercado TEXT NOT NULL,
    selecao TEXT NOT NULL,
    odd NUMERIC(10,3) NOT NULL,
    status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'ganha', 'perdida', 'devolvida', 'meia-ganha', 'meia-perdida', 'cancelada')),
    resultado_jogo TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_bancas_user ON public.bancas(user_id);
CREATE INDEX idx_apostas_user ON public.apostas(user_id);
CREATE INDEX idx_apostas_banca ON public.apostas(banca_id);
CREATE INDEX idx_apostas_data ON public.apostas(data_aposta);
CREATE INDEX idx_bilhetes_user ON public.bilhetes(user_id);

-- RLS POLICIES

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bancas_movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casas_apostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estrategias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bilhetes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bilhete_selecoes ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Bancas
CREATE POLICY "Users can view own bancas" ON public.bancas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bancas" ON public.bancas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bancas" ON public.bancas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bancas" ON public.bancas FOR DELETE USING (auth.uid() = user_id);

-- Bancas Movimentacoes
CREATE POLICY "Users can view own movimentacoes" ON public.bancas_movimentacoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own movimentacoes" ON public.bancas_movimentacoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own movimentacoes" ON public.bancas_movimentacoes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own movimentacoes" ON public.bancas_movimentacoes FOR DELETE USING (auth.uid() = user_id);

-- Casas de Apostas
CREATE POLICY "Users can view own casas" ON public.casas_apostas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own casas" ON public.casas_apostas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own casas" ON public.casas_apostas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own casas" ON public.casas_apostas FOR DELETE USING (auth.uid() = user_id);

-- Estrategias
CREATE POLICY "Users can view own estrategias" ON public.estrategias FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own estrategias" ON public.estrategias FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own estrategias" ON public.estrategias FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own estrategias" ON public.estrategias FOR DELETE USING (auth.uid() = user_id);

-- Apostas
CREATE POLICY "Users can view own apostas" ON public.apostas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own apostas" ON public.apostas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own apostas" ON public.apostas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own apostas" ON public.apostas FOR DELETE USING (auth.uid() = user_id);

-- Bilhetes
CREATE POLICY "Users can view own bilhetes" ON public.bilhetes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bilhetes" ON public.bilhetes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bilhetes" ON public.bilhetes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bilhetes" ON public.bilhetes FOR DELETE USING (auth.uid() = user_id);

-- Bilhete Selecoes
CREATE POLICY "Users can view own bilhete_selecoes" ON public.bilhete_selecoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bilhete_selecoes" ON public.bilhete_selecoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bilhete_selecoes" ON public.bilhete_selecoes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bilhete_selecoes" ON public.bilhete_selecoes FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
