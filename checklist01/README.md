# CHECK LIST SAMU 192 - USA (Suporte Avançado de Vida)

Sistema de gerenciamento de checklist para viaturas de Suporte Avançado (USA) do SAMU 192. Este projeto visa digitalizar e otimizar a conferência de materiais e insumos, garantindo maior agilidade e controle no início de cada plantão.

## 🚀 Funcionalidades

- **Autenticação Segura**: Sistema de login com desafio aleatório para verificação de identidade.
- **Gerenciamento de Turnos**: Suporte para diferentes turnos (Manhã, Tarde, Dia, Noite) com lógica de precedência.
- **Checklist Inteligente**:
    - Cálculo automático de reposição e excesso.
    - Bloqueio de itens baseado na categoria profissional (Médico/Enfermeiro).
    - Indicadores Visuais de status da seção.
- **Painel CME**: Visão consolidada para o Centro de Material e Esterilização, permitindo reposição rápida.
- **Dashboard Estatístico**: Visualização de métricas de participação, picos de preenchimento e rastro de antecessores.
- **Integração com Google Sheets**: Backend robusto utilizando Google Apps Script para persistência de dados.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Design**: Google Fonts (Orbitron, Rajdhani), Glassmorphism UI.
- **Backend**: Google Apps Script (GAS).
- **Banco de Dados**: Google Sheets.

## 📦 Como Usar

Este é um projeto frontend que consome uma API via Google Apps Script. 

1. Clone o repositório.
2. Abra `login.html` no seu navegador (preferencialmente mobile).
3. Utilize suas credenciais cadastradas para acessar o sistema.

## 📄 Notas de Desenvolvimento

O código foi otimizado para performance e legibilidade, mantendo comentários essenciais para manutenção futura. A comunicação com o servidor é feita de forma assíncrona, garantindo uma experiência de usuário fluida.

---
*Desenvolvido para o SAMU 192 Boa Vista.*
