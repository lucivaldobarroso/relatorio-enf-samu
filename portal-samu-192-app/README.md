# Checklist USA SAMU 192

Aplicacao web em React + Vite para checklist operacional da unidade de suporte avancado (USA).

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Supabase (auth/logs/checklist)
- Vitest + Testing Library

## Requisitos

- Node.js 18+
- npm

## Configuracao local

1. Instale dependencias:
```bash
npm install
```
2. Crie o arquivo de ambiente:
```bash
cp .env.example .env
```
3. Preencha no `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
4. Rode em desenvolvimento:
```bash
npm run dev
```

## Scripts

- `npm run dev`: desenvolvimento
- `npm run build`: build de producao
- `npm run preview`: preview local do build
- `npm run lint`: validacao estatica
- `npm run test`: testes unitarios

## Arquitetura

Resumo de arquitetura em `docs/ARCHITECTURE.md`.

## Deploy (GitHub Pages)

- Branch de publicacao: `main`
- Pasta: `/(root)`
- Dominio configurado por `CNAME`
