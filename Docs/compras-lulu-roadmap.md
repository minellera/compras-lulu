# 🛒 Roadmap de Desenvolvimento — **Compras da Lulu**

> Aplicativo mobile (Android + iOS) de lista de compras e lista de desejos, **100% local** (sem login e sem back-end), construído com **React Native**.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Pré-requisitos e Ambiente](#2-pré-requisitos-e-ambiente)
3. [Stack Tecnológica](#3-stack-tecnológica)
4. [Arquitetura do Aplicativo](#4-arquitetura-do-aplicativo)
5. [Modelo de Dados](#5-modelo-de-dados)
6. [Estrutura de Pastas](#6-estrutura-de-pastas)
7. [Mapa de Navegação e Telas](#7-mapa-de-navegação-e-telas)
8. [Regras de Negócio](#8-regras-de-negócio)
9. [Personalização (Temas e Fontes)](#9-personalização-temas-e-fontes)
10. [Importação / Exportação CSV](#10-importação--exportação-csv)
11. [Passo a Passo de Desenvolvimento (Fases)](#11-passo-a-passo-de-desenvolvimento-fases)
12. [Estratégia de Testes](#12-estratégia-de-testes)
13. [Build, Distribuição e Publicação](#13-build-distribuição-e-publicação)
14. [Checklist de Aceite Final](#14-checklist-de-aceite-final)

---

## 1. Visão Geral

**Compras da Lulu** é um app pessoal de organização de compras com dois pilares:

- **Lista de Compras** — listas com itens e quantidades, controle de carrinho via checkbox e fechamento com valor total.
- **Lista de Desejos** — itens que o usuário deseja adquirir, com foto, valor, link e celebração ao concluir a aquisição.

**Princípios do produto**

- Sem login e sem servidor: todos os dados vivem **localmente no dispositivo**.
- Alto grau de **personalização** (8 temas de cor + 5 fontes).
- **Portabilidade** entre instâncias via arquivo **CSV** (export/import).
- Experiência fluida: cadastros rápidos por **pop-up** sem perder o contexto da tela atual.

**Plataformas-alvo:** Android e iOS (codebase única em React Native).

---

## 2. Pré-requisitos e Ambiente

### 2.1 Conhecimentos recomendados

- JavaScript/TypeScript moderno (ES2020+).
- Fundamentos de React (componentes, hooks, estado).
- Noções de React Native e do ecossistema Expo.

### 2.2 Software necessário

| Ferramenta                | Função                             | Observação                                      |
| ------------------------- | ---------------------------------- | ----------------------------------------------- |
| **Node.js LTS**           | Runtime JS                         | Use a versão LTS estável atual                  |
| **npm** ou **pnpm/yarn**  | Gerenciador de pacotes             | Escolha um e padronize                          |
| **Expo CLI** (`npx expo`) | Tooling React Native               | Não precisa instalar globalmente                |
| **Git**                   | Versionamento                      | Repositório desde o dia 1                       |
| **VS Code**               | Editor                             | Extensões: ESLint, Prettier, React Native Tools |
| **Android Studio**        | Emulador Android + SDK             | Necessário para build/teste Android             |
| **Xcode** (apenas macOS)  | Simulador iOS + build              | Build iOS exige macOS                           |
| **Expo Go** (celular)     | Teste rápido em dispositivo físico | App da loja, lê QR code                         |

> 💡 **Recomendação:** começar com **Expo (managed workflow)** acelera o desenvolvimento. Caso futuramente precise de módulos nativos não suportados, é possível migrar para _prebuild / bare workflow_.

### 2.3 Setup inicial do projeto

```bash
# 1. Criar o projeto com TypeScript
npx create-expo-app@latest compras-da-lulu

# 2. Entrar na pasta
cd compras-da-lulu

# 3. Rodar
npx expo start
```

Configurar logo no início:

- **ESLint + Prettier** para padronização de código.
- **TypeScript** em modo `strict`.
- `.gitignore` adequado (node_modules, .expo, etc.).

---

## 3. Stack Tecnológica

| Camada            | Biblioteca sugerida                                                            | Papel                          |
| ----------------- | ------------------------------------------------------------------------------ | ------------------------------ |
| **Framework**     | React Native (via Expo)                                                        | Base do app                    |
| **Linguagem**     | TypeScript                                                                     | Tipagem e segurança            |
| **Navegação**     | `expo-router` ou `@react-navigation/native` (+ Drawer + Stack)                 | Menu lateral + pilha de telas  |
| **Estado global** | `zustand` (recomendado, simples) ou Context API                                | Estado da aplicação            |
| **Persistência**  | `expo-sqlite` (recomendado) **ou** `@react-native-async-storage/async-storage` | Dados locais                   |
| **Ícones**        | `@expo/vector-icons` (Material Icons)                                          | Ícones Google nos itens        |
| **Fontes**        | `expo-font` + `@expo-google-fonts/*`                                           | Fontes do Google               |
| **Imagens**       | `expo-image-picker` + `expo-file-system`                                       | Foto dos itens de desejo       |
| **Arquivos CSV**  | `expo-file-system`, `expo-sharing`, `expo-document-picker`                     | Export/Import                  |
| **Parse CSV**     | `papaparse`                                                                    | Ler/gerar CSV de forma robusta |
| **IDs**           | `expo-crypto` (UUID) ou `nanoid`                                               | Identificadores únicos         |
| **Formulários**   | `react-hook-form` (opcional)                                                   | Validação de formulários       |

> **Decisão de persistência:** prefira **SQLite** se quiser consultas estruturadas e crescimento futuro. Para um MVP rápido, **AsyncStorage** com um repositório JSON também atende. O roadmap assume uma **camada de repositório abstrata** para que a troca de mecanismo não afete o restante do app.

---

## 4. Arquitetura do Aplicativo

Arquitetura em **camadas**, com separação clara de responsabilidades:

```
UI (telas/componentes)
        ↓ usa
Hooks / Stores (estado e regras de orquestração)
        ↓ usa
Services (regras de negócio: CSV, conclusão de compra, etc.)
        ↓ usa
Repositories (acesso a dados — abstração sobre SQLite/AsyncStorage)
        ↓ usa
Storage (SQLite ou AsyncStorage)
```

**Princípios:**

- Telas **não acessam** o storage diretamente — sempre via hooks/stores.
- Toda regra de negócio (ex.: "ao importar, cadastrar item inexistente") fica em **services**, testável isoladamente.
- Repositórios expõem uma interface estável (`create`, `update`, `delete`, `getAll`, `getById`).

---

## 5. Modelo de Dados

> IDs em formato `string` (UUID). Datas em ISO 8601. Valores monetários em **centavos (int)** para evitar erros de ponto flutuante, ou `number` com cuidado de arredondamento.

### 5.1 `PurchaseItem` — Item de Compra (catálogo)

Item reutilizável usado para compor listas de compras.

| Campo            | Tipo          | Regras                                            |
| ---------------- | ------------- | ------------------------------------------------- |
| `id`             | string (UUID) | Obrigatório, único                                |
| `name`           | string        | Obrigatório, único (case-insensitive recomendado) |
| `highlightColor` | string (hex)  | Cor de destaque                                   |
| `icon`           | string        | Nome do ícone Material (ex.: `"shopping-cart"`)   |
| `createdAt`      | string (ISO)  | Auto                                              |
| `updatedAt`      | string (ISO)  | Auto                                              |

### 5.2 `ShoppingList` — Lista de Compras

| Campo         | Tipo                      | Regras                         |
| ------------- | ------------------------- | ------------------------------ |
| `id`          | string (UUID)             | Obrigatório                    |
| `title`       | string                    | Obrigatório                    |
| `description` | string                    | Opcional                       |
| `status`      | `"open"` \| `"completed"` | Default: `"open"`              |
| `totalValue`  | number \| null            | Preenchido somente ao concluir |
| `completedAt` | string (ISO) \| null      | Preenchido ao concluir         |
| `items`       | `ShoppingListItem[]`      | Itens da lista                 |
| `createdAt`   | string (ISO)              | Auto                           |
| `updatedAt`   | string (ISO)              | Auto                           |

### 5.3 `ShoppingListItem` — Item dentro de uma Lista

| Campo            | Tipo                                 | Regras                      |
| ---------------- | ------------------------------------ | --------------------------- |
| `id`             | string (UUID)                        | Obrigatório                 |
| `purchaseItemId` | string                               | FK → `PurchaseItem`         |
| `quantity`       | number                               | > 0                         |
| `quantityType`   | `"unit"` \| `"weight"` \| `"volume"` | un (int), kg, litros        |
| `inCart`         | boolean                              | Default: `false` (checkbox) |

### 5.4 `WishItem` — Item de Desejo

| Campo             | Tipo                 | Regras                              |
| ----------------- | -------------------- | ----------------------------------- |
| `id`              | string (UUID)        | Obrigatório                         |
| `name`            | string               | Obrigatório                         |
| `description`     | string               | Opcional                            |
| `priceBRL`        | number               | Valor em reais                      |
| `icon`            | string               | Ícone Material                      |
| `purchaseLink`    | string (URL)         | Opcional, validar formato           |
| `photoUri`        | string \| null       | Caminho local da foto               |
| `backgroundColor` | string (hex)         | Cor de fundo do card                |
| `acquired`        | boolean              | Default: `false`                    |
| `acquiredAt`      | string (ISO) \| null | Preenchido ao adquirir              |
| `createdAt`       | string (ISO)         | Auto (usado para "3 mais recentes") |
| `updatedAt`       | string (ISO)         | Auto                                |

### 5.5 `AppSettings` — Configurações

| Campo        | Tipo | Regras                                                               |
| ------------ | ---- | -------------------------------------------------------------------- |
| `theme`      | enum | `white \| black \| green \| red \| pink \| yellow \| purple \| blue` |
| `fontFamily` | enum | Uma das 5+ fontes disponíveis                                        |

---

## 6. Estrutura de Pastas

```
compras-da-lulu/
├── app/                          # rotas (se usar expo-router)
│   ├── _layout.tsx               # Drawer (menu lateral) raiz
│   ├── index.tsx                 # Dashboard
│   ├── shopping-lists/
│   │   ├── index.tsx             # Lista de todas as listas
│   │   └── [id].tsx              # Detalhe de uma lista
│   ├── wishlist/
│   │   └── index.tsx             # Lista de desejos
│   ├── catalog/
│   │   └── index.tsx             # Cadastro de itens de compra
│   └── settings/
│       └── index.tsx             # Temas e fontes
│
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── common/               # Button, Modal, Checkbox, IconPicker, ColorPicker
│   │   ├── shopping/             # ShoppingListCard, ListItemRow
│   │   ├── wishlist/             # WishCard
│   │   └── catalog/              # PurchaseItemCard
│   ├── stores/                   # zustand stores
│   │   ├── useShoppingStore.ts
│   │   ├── useWishStore.ts
│   │   ├── useCatalogStore.ts
│   │   └── useSettingsStore.ts
│   ├── services/                 # Regras de negócio
│   │   ├── csv.service.ts        # import/export
│   │   └── purchase.service.ts   # conclusão de compra, ordenações
│   ├── repositories/             # Acesso a dados (abstração)
│   │   ├── db.ts                 # init SQLite / AsyncStorage
│   │   ├── purchaseItem.repo.ts
│   │   ├── shoppingList.repo.ts
│   │   ├── wishItem.repo.ts
│   │   └── settings.repo.ts
│   ├── theme/                    # tokens de cores, fontes, espaçamentos
│   │   ├── themes.ts
│   │   ├── fonts.ts
│   │   └── ThemeProvider.tsx
│   ├── types/                    # interfaces TS (modelos da seção 5)
│   ├── hooks/                    # hooks utilitários
│   └── utils/                    # helpers (uuid, formatadores, validações)
│
├── assets/                       # ícones do app, splash
├── app.json / app.config.ts      # config Expo
└── package.json
```

---

## 7. Mapa de Navegação e Telas

### 7.1 Navegação

- **Drawer (menu lateral)** como navegador raiz, contendo:
  - Dashboard
  - Lista de Compras
  - Lista de Desejos
  - Cadastrar Itens de Compra
  - Exportar / Importar Lista (CSV)
  - Configurações (tema e fonte)
- **Stack** aninhada para navegar até detalhes (ex.: Dashboard → Detalhe da Lista).

### 7.2 Telas

#### 🏠 Dashboard (tela inicial)

- Seção **"Listas em aberto"**: cards das listas com `status === "open"`.
- Seção **"Desejos recentes"**: os **3 `WishItem` mais recentes** (ordenar por `createdAt` desc).
- Dois botões/atalhos principais: **"Lista de Compras"** e **"Lista de Desejos"**.

#### 📋 Lista de Compras

- Botão no topo: **"Criar nova lista de compras"**.
- Listagem: **abertas no topo**, **concluídas abaixo**.

#### ➕ Criar/Editar Lista de Compras

- Campos: **título** (obrigatório) e **descrição**.
- Composição de itens: cada linha = `PurchaseItem` + `quantity` + `quantityType` (un/kg/litros).

#### 🛍️ Detalhe da Lista de Compras

- Lista de itens com **checkbox** (`inCart`).
- Itens marcados **descem para o final** da lista.
- Botão **"Adicionar novo item"** → abre seletor com **todos os itens do catálogo em ordem alfabética** e, no topo, opção **"Adicionar Novo Item"** (pop-up de cadastro sem sair da tela).
- Botão **"Concluir compra"** → pop-up para informar **valor total** → marca lista como **"Concluída"**.
- Ações: **editar** e **excluir** a lista.

#### ⭐ Lista de Desejos

- Botão no topo: **cadastrar novo item de desejo**.
- Seção de **não adquiridos** (topo) e **adquiridos** (separada, abaixo).
- **Toque** no item → marcar como **adquirido** → pop-up de parabéns + opção de atualizar a foto.
- **Toque longo (long-press)** no item → **editar**.

#### 🏷️ Cadastro de Itens de Compra (catálogo)

- Cadastrar item: **nome**, **cor de destaque**, **ícone (Material/Google)**.
- **Editar** e **excluir** itens.

#### ⚙️ Configurações

- Seletor de **tema** (8 cores).
- Seletor de **fonte** (5+ Google Fonts).

#### 🔁 Exportar / Importar (no Drawer)

- **Exportar** lista(s) selecionada(s) para CSV e compartilhar.
- **Importar** CSV → reconstrói a lista, cadastrando itens de catálogo inexistentes.

---

## 8. Regras de Negócio

> Cada regra abaixo deve ter um teste correspondente (ver seção 12).

### RN-01 — Dashboard

- Exibir **apenas** listas com `status === "open"` na seção de listas.
- Exibir **exatamente os 3** itens de desejo mais recentes (`createdAt` desc); se houver menos de 3, exibir os existentes.

### RN-02 — Item de Compra (catálogo)

- `name` é **obrigatório** e **único** (comparação case-insensitive recomendada).
- Ao **excluir** um item do catálogo que está em uso em listas: **bloquear a exclusão** ou avisar e remover as referências. → _Decisão recomendada:_ avisar o usuário e impedir exclusão enquanto houver vínculo, OU marcar como inativo. Defina e documente o comportamento.

### RN-03 — Ordenação na Lista de Compras

- Listas **abertas** sempre acima das **concluídas**.
- Dentro de cada grupo, ordenar por `updatedAt` desc (mais recentes primeiro).

### RN-04 — Quantidade

- `quantityType` define a unidade: `unit` (inteiro), `weight` (kg), `volume` (litros).
- `unit` aceita apenas **inteiros**; `weight`/`volume` aceitam **decimais**.
- `quantity` deve ser **> 0**.

### RN-05 — Adicionar item à lista sem perder progresso

- O seletor de itens lista **todos os itens do catálogo em ordem alfabética**.
- A opção **"Adicionar Novo Item"** abre um **pop-up/modal** que cadastra um novo `PurchaseItem`; ao salvar, o item aparece imediatamente disponível e o estado da lista atual **não é perdido**.

### RN-06 — Carrinho (checkbox)

- Marcar `inCart = true` **move o item para o fim** da lista visual.
- Desmarcar retorna o item à sua posição original (ou ao bloco "não marcados").
- A ordenação visual deve ser estável e previsível.

### RN-07 — Concluir compra

- Botão "Concluir compra" abre pop-up solicitando **valor total** (obrigatório, ≥ 0).
- Ao confirmar: `status = "completed"`, `totalValue = valor`, `completedAt = agora`.
- Lista deixa de aparecer no **Dashboard** e migra para o bloco "Concluídas" na tela de Lista de Compras.

### RN-08 — Editar / Excluir Lista

- Editar permite alterar título, descrição e itens.
- Excluir requer **confirmação** (ação destrutiva irreversível).

### RN-09 — Item de Desejo

- Campos: nome (obrigatório), descrição, valor em reais, ícone, link de compra (URL válida se preenchida), foto, cor de fundo.
- `acquired = false` por padrão.

### RN-10 — Adquirir item de desejo

- Toque marca `acquired = true` e define `acquiredAt = agora`.
- Exibir **pop-up de parabéns** com pergunta: "Quer guardar este momento atualizando a foto?".
  - Se sim → abrir `expo-image-picker` (câmera/galeria) e atualizar `photoUri`.
- Itens adquiridos vão para a **seção separada abaixo** dos não adquiridos.

### RN-11 — Editar item de desejo

- **Long-press** abre a edição do item.

### RN-12 — Exportação CSV

- Gerar CSV de uma lista contendo dados suficientes para reconstrução, incluindo metadados dos itens de catálogo usados.
- Compartilhar via `expo-sharing`.

### RN-13 — Importação CSV

- Ao importar, para cada item da lista:
  - Se o `PurchaseItem` (por **nome**, normalizado) **não existir** no catálogo do importador → **cadastrá-lo imediatamente** com os atributos vindos do CSV (cor, ícone).
  - Se existir, **reutilizar** o item existente.
- Criar a `ShoppingList` importada (decidir: sempre como nova lista com novo `id`; tratar duplicatas).

### RN-14 — Personalização

- Tema e fonte selecionados são **persistidos** e aplicados em **todo o app** imediatamente.

---

## 9. Personalização (Temas e Fontes)

### 9.1 Temas de cor (8)

`white`, `black`, `green`, `red`, `pink`, `yellow`, `purple`, `blue`.

Implementar via **design tokens**. Cada tema define ao menos:

```ts
interface ThemeTokens {
  background: string;
  surface: string; // cards
  text: string;
  textMuted: string;
  primary: string; // cor de acento do tema
  border: string;
  success: string;
  danger: string;
}
```

- Centralizar em `src/theme/themes.ts`.
- Expor via **ThemeProvider** (Context) consumido por todos os componentes.
- ⚠️ Garantir **contraste/acessibilidade** (ex.: texto legível sobre cada fundo, especialmente `white`/`black`/`yellow`).

### 9.2 Fontes (mínimo 5 — Google Fonts)

Sugestões equilibradas (legibilidade + personalidade):

1. **Inter**
2. **Roboto**
3. **Poppins**
4. **Nunito**
5. **Lato**
6. _(extra)_ **Montserrat**

Instalar pacotes `@expo-google-fonts/<fonte>` e carregar com `expo-font` + `useFonts`. Aplicar a fonte escolhida globalmente (componente `Text` base que injeta `fontFamily` do tema).

---

## 10. Importação / Exportação CSV

### 10.1 Estratégia de formato

Como uma lista de compras é uma estrutura aninhada (lista → itens → item de catálogo), o CSV deve ser **achatado (flat)**: uma linha por item da lista, repetindo os metadados da lista. Exemplo de colunas:

```
list_title, list_description, item_name, item_icon, item_color, quantity, quantity_type, in_cart
```

- Use `papaparse` para **gerar** (`Papa.unparse`) e **ler** (`Papa.parse`) com segurança (escape de vírgulas, aspas, acentos).
- Codificação **UTF-8**.

### 10.2 Fluxo de exportação

1. Usuário seleciona a(s) lista(s) no menu lateral.
2. Service monta as linhas (uma por item, com metadados da lista e do item de catálogo).
3. `expo-file-system` grava o arquivo `.csv` em diretório temporário.
4. `expo-sharing` abre a folha de compartilhamento do SO.

### 10.3 Fluxo de importação

1. `expo-document-picker` seleciona o arquivo `.csv`.
2. `papaparse` faz o parse e **valida** o cabeçalho/colunas obrigatórias.
3. Para cada linha:
   - Normalizar `item_name` (trim + lowercase) e buscar no catálogo.
   - Se não existir → **criar** `PurchaseItem` com `name`, `icon`, `highlightColor` do CSV (**RN-13**).
   - Resolver o `purchaseItemId`.
4. Agrupar linhas por lista e criar a(s) `ShoppingList` com seus `ShoppingListItem`.
5. Feedback ao usuário (sucesso, nº de itens importados, nº de itens de catálogo criados, erros de linha).

### 10.4 Tratamento de erros

- Linhas inválidas: registrar e pular (não abortar tudo), reportando ao final.
- Arquivo malformado/colunas faltando: abortar com mensagem clara.

---

## 11. Passo a Passo de Desenvolvimento (Fases)

> Cada fase entrega algo testável. Recomenda-se commits frequentes e uma branch por fase.

### Fase 0 — Fundação (setup)

- Criar projeto Expo + TypeScript.
- Configurar ESLint, Prettier, estrutura de pastas.
- Configurar navegação Drawer + Stack.
- Definir `types/` com todos os modelos (seção 5).
- **Entregável:** app roda com telas vazias navegáveis.

### Fase 1 — Tema e Fontes (base visual)

- Implementar `themes.ts`, `fonts.ts`, `ThemeProvider`.
- Tela de Configurações funcional (trocar tema e fonte, persistir).
- Componente `Text`/`Button` base que consome tokens.
- **Entregável:** trocar tema/fonte muda o app inteiro (RN-14).

### Fase 2 — Persistência e Repositórios

- Inicializar SQLite (ou AsyncStorage) em `db.ts`.
- Implementar repositórios CRUD para as 4 entidades + settings.
- Seed opcional de dados de exemplo (para desenvolvimento).
- **Entregável:** dados persistem entre reaberturas do app.

### Fase 3 — Catálogo de Itens de Compra

- Tela de cadastro com nome, **ColorPicker** e **IconPicker** (Material Icons).
- Listagem, edição e exclusão (RN-02).
- **Entregável:** CRUD de `PurchaseItem` completo.

### Fase 4 — Listas de Compras (núcleo)

- Tela de listagem (abertas/concluídas, RN-03).
- Criar/editar lista (título, descrição).
- Adicionar itens com quantidade + tipo (RN-04).
- Seletor de itens alfabético + "Adicionar Novo Item" via pop-up (RN-05).
- **Entregável:** criar lista com itens funcionando.

### Fase 5 — Detalhe da Lista + Conclusão

- Checkbox de carrinho + reordenação (RN-06).
- Botão "Concluir compra" + pop-up de valor total (RN-07).
- Editar/excluir lista com confirmação (RN-08).
- **Entregável:** ciclo completo de uma compra.

### Fase 6 — Lista de Desejos

- CRUD de `WishItem` (nome, descrição, valor, ícone, link, foto, cor).
- Foto via `expo-image-picker`.
- Marcar como adquirido + pop-up de parabéns + atualizar foto (RN-10).
- Seção separada de adquiridos (RN-10).
- Long-press para editar (RN-11).
- **Entregável:** lista de desejos completa.

### Fase 7 — Dashboard

- Seção de listas abertas + atalhos principais.
- 3 desejos mais recentes (RN-01).
- **Entregável:** dashboard ligado aos dados reais.

### Fase 8 — Import / Export CSV

- Service de exportação + `expo-sharing`.
- Service de importação + auto-cadastro de itens (RN-12, RN-13).
- Opções no menu lateral.
- **Entregável:** transferir lista entre dois dispositivos.

### Fase 9 — Polimento e QA

- Estados vazios (empty states) em todas as telas.
- Validações de formulário e mensagens de erro.
- Acessibilidade e contraste por tema.
- Testes (seção 12) e correções.
- **Entregável:** app pronto para build de produção.

---

## 12. Estratégia de Testes

### 12.1 Testes unitários (lógica/serviços)

Ferramenta: **Jest** + **@testing-library/react-native**.

Cobrir prioritariamente:

- Ordenações (RN-03, RN-06).
- Conclusão de compra (RN-07).
- Validação de quantidade por tipo (RN-04).
- Geração e parse de CSV (RN-12).
- **Auto-cadastro de itens na importação (RN-13)** — caso crítico.
- Seleção dos 3 desejos mais recentes (RN-01).

### 12.2 Testes de componente

- Pop-up de "Adicionar Novo Item" não perde o estado da lista (RN-05).
- Checkbox move item para o fim (RN-06).
- Long-press abre edição (RN-11).

### 12.3 Testes manuais / E2E (opcional)

- Ferramenta: **Maestro** (simples para fluxos mobile) ou **Detox**.
- Fluxos-chave: criar lista → adicionar itens → concluir; exportar e importar em outra instância.

### 12.4 Matriz de testes manuais (mínimo)

| Cenário                                   | Resultado esperado                              |
| ----------------------------------------- | ----------------------------------------------- |
| Trocar tema e reabrir app                 | Tema persiste                                   |
| Criar item de catálogo com nome duplicado | Bloqueado/avisado (RN-02)                       |
| Marcar item no carrinho                   | Desce para o fim (RN-06)                        |
| Concluir compra                           | Sai do dashboard, vai p/ "Concluídas" (RN-07)   |
| Adquirir desejo                           | Pop-up de parabéns + opção de foto (RN-10)      |
| Importar CSV com item novo                | Item criado no catálogo automaticamente (RN-13) |
| Importar CSV malformado                   | Erro claro, sem corromper dados                 |

### 12.5 Testes em dispositivos

- Testar em **Android** (emulador + físico) e **iOS** (simulador + físico, se possível).
- Testar telas pequenas e grandes; modo claro/escuro do SO não deve quebrar os temas.

---

## 13. Build, Distribuição e Publicação

### 13.1 Configuração

- Definir `name`, `slug`, `version`, ícones e splash em `app.json`/`app.config.ts`.
- Definir `bundleIdentifier` (iOS) e `package` (Android).
- Solicitar permissões necessárias (câmera/galeria para foto dos desejos).

### 13.2 Build com EAS (Expo Application Services)

```bash
# Instalar e logar
npm install -g eas-cli
eas login

# Configurar
eas build:configure

# Builds
eas build -p android --profile preview     # APK/AAB de teste
eas build -p ios --profile preview         # exige conta Apple Developer
```

### 13.3 Distribuição

- **Android:** gerar `.aab` e publicar na **Google Play Console** (conta de desenvolvedor paga, taxa única).
- **iOS:** publicar via **App Store Connect** (conta Apple Developer, assinatura anual; build exige macOS/Xcode ou EAS).
- Testes internos antes de produção (Play: faixa de teste interno; iOS: TestFlight).

> Confirme requisitos de contas, taxas e políticas das lojas no momento da publicação, pois mudam com frequência.

---

## 14. Checklist de Aceite Final

- [ ] App roda em Android e iOS sem login e sem chamadas de rede obrigatórias.
- [ ] Dashboard mostra listas abertas + 3 desejos mais recentes + atalhos principais.
- [ ] CRUD completo de itens de compra (nome, cor, ícone Material).
- [ ] Listas de compras: criar (título + descrição), abertas no topo / concluídas abaixo.
- [ ] Itens com quantidade em unidade/kg/litros, validados.
- [ ] Seletor de itens alfabético + "Adicionar Novo Item" em pop-up sem perder o progresso.
- [ ] Checkbox de carrinho move itens para o fim.
- [ ] "Concluir compra" registra valor total e marca como concluída no dashboard.
- [ ] Editar e excluir listas (com confirmação).
- [ ] Lista de desejos com todos os campos (incl. foto e cor de fundo).
- [ ] Marcar como adquirido → pop-up de parabéns + opção de atualizar foto.
- [ ] Adquiridos em seção separada; long-press edita.
- [ ] Exportar e importar listas via CSV; itens inexistentes são cadastrados na importação.
- [ ] Opções de export/import no menu lateral.
- [ ] 8 temas de cor + 5+ fontes Google, persistidos e aplicados globalmente.
- [ ] Persistência local entre reaberturas do app.
- [ ] Testes das regras críticas passando.

---

### 📌 Decisões em aberto a confirmar antes do início

1. **Persistência:** SQLite (robusto) ou AsyncStorage (mais simples)?
2. **Exclusão de item de catálogo em uso:** bloquear, marcar inativo ou remover referências?
3. **Importação de lista duplicada:** sempre criar nova, ou detectar e atualizar a existente?
4. **Compartilhamento CSV:** uma lista por arquivo ou várias listas no mesmo arquivo?

Defina essas quatro questões no início para evitar retrabalho nas fases 2, 3 e 8.
