# Checklist USA SAMU 192

Aplicacao web em React + Vite para checklist operacional da unidade de suporte avancado (USA), com execucao por turno, historico operacional e painel estatistico.

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

## Fluxo operacional (resumo)

- Login por servidor + VTR + desafio de nascimento + senha.
- Ao abrir/recarregar, o turno inicia vazio e deve ser selecionado antes de liberar as acoes.
- Checklist por secao/item com envio unitario ou envio da secao completa.
- Itens `INDISPONIVEL CME` nao contam como pendencia de conclusao.
- No turno `NOITE`, a conclusao e mantida na virada de data (18:00 ate 06:00).

## Arquitetura

Resumo de arquitetura em `docs/ARCHITECTURE.md`.

## Mobile e compatibilidade

- Layout responsivo com sidebar colapsavel e topbar fixa no dashboard.
- Viewport configurado com `viewport-fit=cover`.
- Meta tags para web app em Android/iOS e status bar Apple.
- Suporte a navegadores modernos mobile (Chrome Android e Safari iOS).

## Deploy (GitHub Pages)

- Branch de publicacao: `main`
- Source: `Deploy from a branch`
- Pasta: `/(root)` do repositorio
- Base de build: `/checklist/` (configurada em `vite.config.ts`)
- Entrada publica alternativa: `checklist/samu.html` (redireciona para `/checklist/`)
- Dominio configurado por `CNAME`

## Checklist pre-publicacao

1. `npm run lint`
2. `npm run test`
3. `npm run build`
4. Confirmar `Settings > Pages` no branch `main`
5. Validar acesso em:
- `https://lucivaldobarroso.enf.br/checklist/`
- `https://lucivaldobarroso.enf.br/checklist/samu.html`
