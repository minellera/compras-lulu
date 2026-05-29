# Task 00 — Fundação do Projeto e Navegação

> **Objetivo:** Criar o esqueleto do app (Expo + TypeScript), configurar tooling, navegação por menu lateral (Drawer) e todas as telas vazias navegáveis, além de definir os tipos de domínio.

---

## Definition of Ready (condições de início)

- [ ] Node.js LTS instalado.
- [ ] Git instalado e repositório vazio inicializado.
- [ ] Nenhuma dependência das demais tasks (esta é a primeira).

## Dependências

Nenhuma. Esta é a task base.

---

## Escopo

### Dentro do escopo
- Criar projeto Expo com TypeScript.
- Configurar ESLint + Prettier + `tsconfig` strict.
- Estrutura de pastas completa (com placeholders).
- Navegação Drawer (menu lateral) + Stacks aninhadas.
- Telas vazias (placeholder) navegáveis.
- Definição de **todos os tipos de domínio** em `src/types`.
- Helpers utilitários base (uuid, datas, dinheiro).

### Fora do escopo
- Persistência (Task 02).
- Tema/cores reais e fontes (Task 01).
- Qualquer regra de negócio ou CRUD.

---

## Especificação técnica

### Stack
- Expo (managed) + React Native + TypeScript.
- Navegação: `@react-navigation/native`, `@react-navigation/drawer`, `@react-navigation/native-stack` **ou** `expo-router`. **Decisão:** usar `expo-router` (file-based) para simplicidade.

### Comandos de criação
```bash
npx create-expo-app@latest compras-da-lulu
cd compras-da-lulu
npx expo install expo-router react-native-safe-area-context react-native-screens \
  react-native-gesture-handler react-native-reanimated @react-navigation/drawer
npm i -D eslint prettier eslint-config-expo
npm i nanoid
```

### Estrutura de pastas a criar
```
app/
  _layout.tsx                 # Drawer raiz com itens do menu
  index.tsx                   # Dashboard (placeholder)
  shopping-lists/index.tsx    # placeholder
  shopping-lists/[id].tsx     # placeholder
  wishlist/index.tsx          # placeholder
  catalog/index.tsx           # placeholder
  settings/index.tsx          # placeholder
  data-transfer/index.tsx     # placeholder (CSV)
src/
  components/common/
  components/shopping/
  components/wishlist/
  components/catalog/
  stores/                     # vazio por enquanto
  services/                   # vazio por enquanto
  repositories/               # vazio por enquanto
  theme/                      # vazio por enquanto
  types/index.ts              # TODOS os tipos
  hooks/
  utils/uuid.ts
  utils/date.ts
  utils/money.ts
```

### Tipos de domínio (`src/types/index.ts`) — implementar exatamente
```ts
export type QuantityType = 'unit' | 'weight' | 'volume';
export type ListStatus = 'open' | 'completed';

export interface PurchaseItem {
  id: string;
  name: string;
  highlightColor: string; // hex
  icon: string;           // nome do Material Icon
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
}

export interface ShoppingListItem {
  id: string;
  purchaseItemId: string;
  quantity: number;       // > 0
  quantityType: QuantityType;
  inCart: boolean;
}

export interface ShoppingList {
  id: string;
  title: string;
  description: string;
  status: ListStatus;
  totalValue: number | null;
  completedAt: string | null;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishItem {
  id: string;
  name: string;
  description: string;
  priceBRL: number;
  icon: string;
  purchaseLink: string;   // pode ser ''
  photoUri: string | null;
  backgroundColor: string; // hex
  acquired: boolean;
  acquiredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ThemeName =
  | 'white' | 'black' | 'green' | 'red'
  | 'pink' | 'yellow' | 'purple' | 'blue';

export type FontName =
  | 'Inter' | 'Roboto' | 'Poppins' | 'Nunito' | 'Lato';

export interface AppSettings {
  theme: ThemeName;
  fontFamily: FontName;
}
```

### Utilitários
- `utils/uuid.ts`: exporta `newId(): string` (usando `nanoid`).
- `utils/date.ts`: exporta `nowIso(): string`.
- `utils/money.ts`: exporta `roundMoney(v: number): number` (2 casas) e `formatBRL(v: number): string`.

### Drawer (`app/_layout.tsx`)
Itens do menu, nesta ordem:
1. Dashboard → `/`
2. Lista de Compras → `/shopping-lists`
3. Lista de Desejos → `/wishlist`
4. Cadastrar Itens → `/catalog`
5. Exportar / Importar → `/data-transfer`
6. Configurações → `/settings`

Cada tela placeholder deve renderizar apenas o título centralizado (ex.: `<Text>Dashboard</Text>`).

---

## Regras de negócio envolvidas

Nenhuma regra de negócio funcional nesta task — apenas estrutura.

---

## Definition of Done (condições de fim)

- [ ] `npx expo start` roda sem erros.
- [ ] App abre no Dashboard.
- [ ] É possível abrir o Drawer e navegar para **todas** as 6 entradas do menu.
- [ ] `npx tsc --noEmit` passa sem erros.
- [ ] `npx eslint .` passa sem erros.
- [ ] `src/types/index.ts` contém todos os tipos acima.
- [ ] Utilitários `uuid`, `date`, `money` existem e exportam as funções descritas.

## Como validar
```bash
npx tsc --noEmit
npx eslint .
npx expo start   # navegar manualmente por todas as telas via Drawer
```

## Sugestão de commit
```
chore: bootstrap expo + typescript, navigation drawer and domain types
```

## Entrega para a próxima task
A Task 01 e a Task 02 assumem que existem: estrutura de pastas, tipos de domínio e navegação funcionando.
