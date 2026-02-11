
# Documentação Técnica - Cantina Fácil V5.0

## 1. Visão Geral
O **Cantina Fácil** é um ecossistema de gestão "smart-retail" para ambientes educacionais e corporativos. Utiliza uma arquitetura cliente-local com persistência em cache persistente, focando em performance extrema e privacidade total do usuário.

## 2. Arquitetura do Sistema
### Tecnologias Core:
- **UI Framework**: React 19 (Hooks/Context).
- **Estilização**: Tailwind CSS com Design System "Balloon Contrast".
- **Banco de Dados**: LocalStorage persistente (Client-side NoSQL).
- **Inteligência**: Integração Gemini AI para previsibilidade de estoque.

## 3. Funcionalidades de Gestão de Usuário
### 3.1 Histórico de Consumo Relacional
Cada transação finalizada é vinculada ao ID do usuário autenticado. Isso permite que:
- O usuário visualize seu extrato de compras em tempo real.
- O administrador gerencie dívidas ("Plano Quinzenal") de forma individualizada.

### 3.2 Sistema de Favoritos
Os usuários podem favoritar itens no cardápio através de um ícone de coração.
- **Armazenamento**: Array de IDs persistido no objeto `User`.
- **Exibição**: Seção dedicada no Dashboard para itens prediletos.

### 3.3 Gestão Financeira "Fiado" (Plano Quinzenal)
O sistema calcula automaticamente o saldo devedor baseado no cruzamento de transações do tipo `sale` (modalidade quinzenal) e `payment` (quitação).

## 4. Experiência de Interface (UX/UI)
- **Wide & Mobile Responsive**: O layout se adapta de telas mobile 4" até desktops wide 27", mantendo as proporções dos elementos de interface.
- **Glassmorphism Interactive**: Uso de borrão de fundo e transparência para destacar cards sobre o background dinâmico.
- **Floating Checkout**: O painel de carrinho é persistente na visualização do usuário durante o scroll no cardápio.

## 5. Segurança e Privacidade
- **Zero-Backend**: Dados sensíveis nunca saem do dispositivo do usuário.
- **Padronização Institucional**: Canais de suporte e políticas de privacidade integrados nativamente em todas as telas via sistema de rodapé único.

## 6. API Gemini
- **Modelo Flash**: Análise rápida de reposição.
- **Modelo Pro**: Auditoria financeira e geração de insights de margem de lucro.
