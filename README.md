# Compras da Lulu

Aplicativo mobile de lista de compras e lista de desejos, **100% local** (sem login, sem back-end), construído com React Native + Expo.

---

## Sobre o projeto

**Compras da Lulu** tem dois pilares principais:

- **Lista de Compras** — listas com itens e quantidades, controle de carrinho via checkbox e fechamento com valor total.
- **Lista de Desejos** — itens que o usuário deseja adquirir, com foto, valor, link e celebração ao marcar como adquirido.

Todos os dados ficam armazenados localmente no dispositivo (SQLite). O app suporta personalização com 8 temas de cor e 5 fontes Google, e futuramente permitirá portabilidade via exportação/importação de CSV.

---

## Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native via Expo SDK 56 (managed workflow) |
| Linguagem | TypeScript 6 (strict) |
| Navegação | expo-router (file-based) + Drawer + Stack |
| Estado global | Zustand 5 |
| Persistência | expo-sqlite (SQLite) |
| Fontes | expo-font + @expo-google-fonts |
| Testes | Jest 29 + jest-expo + @testing-library/react-native |
| Linting | ESLint 9 (flat config) + Prettier |

---

## Estrutura do repositório

```
compras-lulu/
├── Docs/                          # Especificações e roadmap
│   ├── compras-lulu-roadmap.md
│   ├── task-00-fundacao.md
│   ├── task-01-tema-fontes.md
│   ├── task-02-persistencia.md
│   └── task-03 … task-09.md
└── compras-da-lulu/               # Projeto Expo (todos os comandos aqui)
    ├── src/
    │   ├── app/                   # Telas (expo-router file-based)
    │   │   ├── _layout.tsx        # Drawer raiz + boot (db init + fontes)
    │   │   ├── index.tsx          # Dashboard (placeholder)
    │   │   ├── shopping-lists/    # index + [id] + _layout (Stack)
    │   │   ├── wishlist/
    │   │   ├── catalog/
    │   │   ├── settings/          # Seletor de tema e fonte (funcional)
    │   │   └── data-transfer/
    │   ├── components/
    │   │   └── common/            # ThemedText, ThemedButton, Screen
    │   ├── repositories/          # Camada de dados (SQLite)
    │   │   ├── db.ts              # init + singleton
    │   │   ├── purchaseItem.repo.ts
    │   │   ├── shoppingList.repo.ts
    │   │   ├── wishItem.repo.ts
    │   │   ├── settings.repo.ts
    │   │   └── seed.ts            # dados de dev (opcional)
    │   ├── stores/                # Zustand
    │   │   ├── useCatalogStore.ts
    │   │   ├── useShoppingStore.ts
    │   │   ├── useWishStore.ts
    │   │   └── useSettingsStore.ts
    │   ├── theme/
    │   │   ├── themes.ts          # 8 temas com tokens de contraste
    │   │   ├── fonts.ts           # 5 Google Fonts
    │   │   └── ThemeProvider.tsx  # Context + useTheme()
    │   ├── types/
    │   │   └── index.ts           # Todos os tipos de domínio
    │   └── utils/
    │       ├── uuid.ts            # newId()
    │       ├── date.ts            # nowIso()
    │       └── money.ts           # roundMoney(), formatBRL()
    ├── __tests__/                 # Testes unitários dos repositórios
    ├── metro.config.js            # assetExts: wasm (expo-sqlite)
    ├── jest.config.js
    ├── eslint.config.js
    └── tsconfig.json
```

---

## Como rodar

Todos os comandos devem ser executados dentro de `compras-da-lulu/`:

```bash
cd compras-da-lulu

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npx expo start

# Testes unitários
npm test

# Verificação de tipos
npx tsc --noEmit

# Linting
npx eslint .
```

Abra o app em um simulador iOS, emulador Android ou via Expo Go escaneando o QR code exibido no terminal.

---

## Estado atual do desenvolvimento

| Task | Descrição | Status |
|------|-----------|--------|
| 00 — Fundação | Expo + TypeScript, navegação Drawer, tipos de domínio, utilitários | Concluída |
| 01 — Tema e Fontes | 8 temas, 5 fontes Google, ThemeProvider, componentes base, tela de Configurações | Concluída |
| 02 — Persistência | SQLite, repositórios CRUD (4 entidades), stores Zustand, testes unitários | Concluída |
| 03 — Catálogo de Itens | CRUD de PurchaseItem com ColorPicker e IconPicker | Pendente |
| 04 — Listas de Compras | Tela de listagem, criar/editar lista, adicionar itens | Pendente |
| 05 — Detalhe + Conclusão | Checkbox de carrinho, concluir compra, editar/excluir | Pendente |
| 06 — Lista de Desejos | CRUD de WishItem, marcar adquirido, foto | Pendente |
| 07 — Dashboard | Listas abertas + 3 desejos recentes + atalhos | Pendente |
| 08 — Import / Export CSV | Exportar e importar listas via CSV | Pendente |
| 09 — Polimento e QA | Empty states, validações, acessibilidade, testes | Pendente |

---

## Decisões técnicas adotadas

| Questão | Decisão |
|---------|---------|
| Persistência | SQLite via expo-sqlite |
| Exclusão de item de catálogo em uso | Bloqueada (`countListReferences` implementado) |
| Importação de lista duplicada | Sempre cria nova lista com novo ID |
| Compartilhamento CSV | A definir na Task 08 |

---

## Documentação detalhada

Cada task tem sua especificação completa em `Docs/`. O roadmap geral está em [`Docs/compras-lulu-roadmap.md`](Docs/compras-lulu-roadmap.md).
