# Task 02 — Persistência, Repositórios e Stores

> **Objetivo:** Implementar a camada de dados local com `expo-sqlite`, repositórios CRUD para todas as entidades, stores `zustand` que orquestram o acesso, e unificar as settings (migrando o que a Task 01 fez em AsyncStorage). Nenhuma tela de domínio ainda — apenas a fundação de dados, testável.

---

## Definition of Ready (condições de início)

- [ ] Task 00 concluída (tipos de domínio existem).
- [ ] Recomendado: Task 01 concluída (settings já têm um lar; aqui unificamos).

## Dependências
- Task 00 (obrigatória). Task 01 (recomendada para unificar settings).

---

## Escopo

### Dentro do escopo
- Inicialização do banco SQLite e criação de tabelas/migrations.
- Repositórios CRUD: `purchaseItem`, `shoppingList`, `wishItem`, `settings`.
- Stores `zustand`: `useCatalogStore`, `useShoppingStore`, `useWishStore`, `useSettingsStore`.
- Testes unitários dos repositórios e/ou da serialização.
- Função de **seed** opcional para desenvolvimento.

### Fora do escopo
- Telas de domínio (Tasks 03–07).
- CSV (Task 08).

---

## Especificação técnica

### Dependências
```bash
npx expo install expo-sqlite
npm i zustand
npm i -D jest jest-expo @testing-library/react-native @types/jest
```

### Banco (`src/repositories/db.ts`)
- Abrir/instanciar banco `compras-da-lulu.db`.
- Criar tabelas (idempotente, `CREATE TABLE IF NOT EXISTS`):
  - `purchase_items(id, name, highlight_color, icon, created_at, updated_at)`
  - `shopping_lists(id, title, description, status, total_value, completed_at, created_at, updated_at)`
  - `shopping_list_items(id, list_id, purchase_item_id, quantity, quantity_type, in_cart)` — FK `list_id` → `shopping_lists.id` (ON DELETE CASCADE)
  - `wish_items(id, name, description, price_brl, icon, purchase_link, photo_uri, background_color, acquired, acquired_at, created_at, updated_at)`
  - `app_settings(id, theme, font_family)` — linha única (id fixo = `'singleton'`)
- `name` em `purchase_items` deve ter índice único **case-insensitive** (`COLLATE NOCASE`).

### Repositórios (interface comum)
Cada repositório expõe funções puras de acesso (async). Exemplos:
```ts
// purchaseItem.repo.ts
getAll(): Promise<PurchaseItem[]>
getById(id: string): Promise<PurchaseItem | null>
getByName(name: string): Promise<PurchaseItem | null> // case-insensitive
create(data): Promise<PurchaseItem>
update(id, patch): Promise<PurchaseItem>
remove(id): Promise<void>
countListReferences(id): Promise<number> // p/ RN-02 (exclusão bloqueada)
```
- `shoppingList.repo.ts`: persiste a lista **e** seus `shopping_list_items` (transação). `getAll` retorna listas com `items` hidratados.
- `wishItem.repo.ts`: CRUD direto.
- `settings.repo.ts`: `get(): Promise<AppSettings>` (cria default se ausente) e `save(settings)`.

> **Regra de mapeamento:** snake_case no banco ↔ camelCase nos tipos. Centralize a conversão em funções `rowToEntity` / `entityToRow` por repositório.

### Stores (`src/stores/`)
Cada store `zustand` mantém o estado em memória e delega persistência ao repositório:
- `useCatalogStore`: `items`, `load()`, `add()`, `edit()`, `remove()`.
- `useShoppingStore`: `lists`, `load()`, `create()`, `update()`, `remove()`, `complete()`.
- `useWishStore`: `items`, `load()`, `add()`, `edit()`, `remove()`, `markAcquired()`.
- `useSettingsStore`: `settings`, `load()`, `setTheme()`, `setFont()` — **substitui** o AsyncStorage temporário da Task 01 (o `ThemeProvider` passa a ler/escrever via este store/repo). Manter compatibilidade: migrar valor antigo se existir.

### Boot
- No `_layout.tsx`, garantir `db.init()` e `load()` dos stores essenciais antes de renderizar (ou com estado de loading).

### Seed (`src/repositories/seed.ts`) — opcional
- Função `seedDev()` que cria alguns `PurchaseItem` e um `WishItem` de exemplo. Só chamar em ambiente de desenvolvimento.

### Testes (`__tests__/`)
- Mockar SQLite ou usar um adaptador em memória para testar repositórios.
- Testes mínimos:
  - Criar e recuperar `PurchaseItem`; garantir unicidade de nome (case-insensitive).
  - Criar `ShoppingList` com itens e recuperá-la hidratada.
  - `settings.repo` retorna default quando vazio e persiste após `save`.

---

## Regras de negócio envolvidas
- **RN-02 (parcial):** `countListReferences` dá suporte ao bloqueio de exclusão (consumido na Task 03).
- **RN-14:** settings persistidas (unificadas aqui).

---

## Definition of Done (condições de fim)

- [ ] `db.init()` cria todas as tabelas sem erro e é idempotente.
- [ ] Os 4 repositórios + settings implementam o CRUD descrito.
- [ ] Os 4 stores expõem as ações descritas e carregam do banco.
- [ ] Dados persistem entre reaberturas do app (verificável com seed + reabrir).
- [ ] Settings da Task 01 continuam funcionando, agora via store/repo.
- [ ] Testes unitários passam (`npm test`).
- [ ] `npx tsc --noEmit` e `npx eslint .` passam.

## Como validar
```bash
npm test
npx tsc --noEmit
npx eslint .
# Manual: ativar seedDev(), reabrir o app, confirmar persistência via logs/estado.
```

## Sugestão de commit
```
feat: local persistence with sqlite, repositories and zustand stores
```

## Entrega para a próxima task
As Tasks 03–07 consomem os stores. Nenhuma tela acessará o banco diretamente.
