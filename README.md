# ApostaControl

Sistema SaaS de controle de apostas esportivas focado em futebol.

## Tecnologias

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Segurança**: Row Level Security (RLS)

## Configuração do Ambiente

### 1. Clonar o repositório

```bash
git clone <seu-repo>
cd aposta-control
npm install
```

### 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com).
2. Vá em **Project Settings > API** e copie a `URL` e a `anon public` key.
3. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase/schema.sql` deste projeto. Isso criará todas as tabelas e políticas de segurança.

### 3. Variáveis de Ambiente

Renomeie o arquivo `.env.local.example` para `.env.local` e preencha com suas credenciais:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Rodar Localmente

```bash
npm run dev
```

O projeto estará rodando em `http://localhost:3000`.

## Estrutura do Projeto

- `/app`: Páginas e rotas da aplicação (App Router).
  - `(dashboard)`: Rotas protegidas (Dashboard, Bancas, Apostas, etc).
  - `auth`: Rotas de autenticação (Login, Registro).
  - `api`: Rotas de API (Backend).
- `/components`: Componentes reutilizáveis.
- `/lib`: Configurações de clientes (Supabase, Utils).
- `/supabase`: Arquivos relacionados ao banco de dados (Schema).

## Deploy

O projeto está pronto para deploy na [Vercel](https://vercel.com).

1. Importe o repositório na Vercel.
2. Configure as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Deploy!
