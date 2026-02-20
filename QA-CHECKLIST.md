# QA Checklist - Fluxo Portal -> Checklist (Dev e Prod)

## Regra de ouro (obrigatoria)
- Este documento e regra operacional obrigatoria antes de qualquer alteracao.
- Nenhuma mudanca deve ser aplicada sem revisar este QA por completo.
- Nao alterar comportamento que ja esta funcionando sem solicitacao explicita.
- Toda mudanca deve ser pequena, isolada e validada antes de seguir para a proxima.
- Se um ajuste afetar autenticacao, links ou redirecionamento, validar este checklist completo.

## Escopo critico
- Portal local: `http://localhost:3000`
- Checklist local: `http://localhost:8080`
- Producao checklist: `https://lucivaldobarroso.enf.br/checklist/`

## Pre-check (antes de mexer)
1. Confirmar branch e diff atual (`git status`).
2. Registrar o comportamento atual com teste manual rapido.
3. Identificar arquivos exatos da mudanca (nao editar fora do escopo).
4. Confirmar infraestrutura local ativa:
- Portal em `3000` (`netstat -ano | findstr :3000`)
- Checklist em `8080` (`netstat -ano | findstr :8080`)

## Validacao obrigatoria em dev
1. Subir portal local (`npm run dev`).
2. Subir checklist local (`cd checklist` + `npm run dev -- --host 127.0.0.1 --port 8080`).
3. Login no portal.
4. Clicar card de checklist (enfermeiro/medico/tecnico):
- Deve abrir `localhost:8080`.
- Nao deve aparecer tela antiga de login.
- Deve entrar com sessao reaproveitada.
5. Em tela inicial do checklist:
- Dados do servidor devem aparecer.
- Selecao de VTR deve estar funcional.
6. Botao `Sair` no checklist:
- Deve redirecionar para `http://localhost:3000/#home`.
7. Sem sessao no portal (abrindo checklist direto):
- Deve mostrar erro controlado.
- Deve redirecionar automaticamente ao portal.
8. Validacao de perfil da VTR (USA/USB/EVENTO):
- Selecionar uma VTR USA: deve carregar itens/secoes configurados para USA.
- Selecionar uma VTR USB: deve carregar itens/secoes configurados para USB.
- Itens com `aplica_vtr` vazio/ausente devem continuar aparecendo (compatibilidade).

## Diagnostico rapido (falhas comuns)
- Erro: `ERR_CONNECTION_REFUSED` ao clicar no card de checklist.
- Causa mais comum: checklist local nao esta rodando na porta `8080`.
- Verificacao:
- `netstat -ano | findstr :8080`
- Se nao aparecer `LISTENING`, o checklist esta parado.
- Correcao:
- `cd checklist`
- `npm run dev -- --host 127.0.0.1 --port 8080`
- Confirmar no navegador: `http://127.0.0.1:8080/` (pagina deve abrir).

- Erro: card abre URL errada em dev.
- Causa comum: alteracao indevida em `CHECKLIST_URL` ou bypass do fluxo de bridge.
- Verificacao:
- Em dev, destino deve ser `http://localhost:8080/`.
- Nao reintroduzir login legado no checklist.
- Bridge por URL somente em dev.

## Validacao obrigatoria em producao (sanidade)
1. Link de checklist abre no dominio oficial.
2. URL nao deve conter `bridge=`.
3. Fluxo nao deve exibir login legado.

## Guardrails tecnicos
- Nao reintroduzir login legado no checklist.
- Nao remover fallback de erro com retorno ao portal.
- Nao alterar `CHECKLIST_URL` sem checar dev/prod:
- `dev`: `http://localhost:8080/`
- `prod`: `https://lucivaldobarroso.enf.br/checklist/`
- Bridge por URL somente em dev.

## Criterio de pronto
- Todos os itens acima validados.
- Build do checklist concluida sem erro (`cd checklist && npm run build`).
- Mudancas limitadas aos arquivos do escopo.

## Checklist de encerramento obrigatorio
1. Registrar no PR/entrega qual foi a causa raiz (se houve incidente).
2. Registrar qual item deste QA evitou ou detectou a falha.
3. Confirmar que o fluxo Portal -> Checklist foi retestado manualmente.

## Adendo operacional (fonte -> producao) [2026-02-20]
- Este adendo complementa o QA sem substituir itens anteriores.
- Manter este fluxo para evitar tela branca e deploy inconsistente.

### Estrategia de repositorios
- Repositorio fonte (desenvolvimento): `portal-samu-192-fonte`.
- Repositorio producao (site publico): `PORTAL-SAMU-192`.
- Alteracoes devem nascer no repositorio fonte e somente depois serem publicadas no repositorio producao.

### Regra critica de publicacao
- Nao publicar arquivos `.tsx`/`.ts` diretamente no repositorio de producao.
- Publicacao no repositorio de producao deve usar arquivos compilados (build):
- `index.html` compilado.
- `assets/*.js` e `assets/*.css` gerados pelo build.
- Se o `index.html` de producao apontar para `index.tsx` (ou outro arquivo de fonte), o site quebra com tela branca.

### Fluxo obrigatorio de deploy
1. No repositorio fonte, executar build (`npm run build`).
2. Validar que `dist/index.html` e `dist/assets/*` foram gerados sem erro.
3. Copiar para o repositorio producao:
- `dist/index.html` -> `PORTAL-SAMU-192/index.html`
- `dist/assets/*` -> `PORTAL-SAMU-192/assets/`
4. No repositorio producao, revisar diff (somente arquivos de build esperados).
5. Commit e push no repositorio producao.
6. Validar site em producao com `Ctrl + F5`.

### Validacao obrigatoria de producao (anti-tela-branca)
- Abrir DevTools e confirmar ausencia de erro 404 para `index.tsx`.
- Confirmar que `index.html` carrega bundle de `assets/index-*.js`.
- Confirmar carregamento visual da home e navegacao basica.

### Rollback padrao (incidente)
- Em caso de falha pos-deploy:
1. GitHub Desktop -> `History`.
2. Selecionar commit publicado.
3. `Revert changes in commit`.
4. `Push origin`.
5. Revalidar site em janela anonima + `Ctrl + F5`.

### Observacoes operacionais
- Warnings de chunk grande no Vite nao bloqueiam deploy se o build finalizou com `built`.
- Erro `'vite' nao e reconhecido` indica dependencia faltando; instalar dependencias antes do build.
- Em Windows/PowerShell, usar comandos compativeis (`Remove-Item -Recurse -Force`) para limpeza de dependencias quando necessario.
