# Task 03 — Catálogo de Itens de Compra

> **Objetivo:** Implementar o CRUD completo de `PurchaseItem` (catálogo reutilizável), incluindo seletor de ícone (Material/Google) e seletor de cor de destaque, com edição, exclusão bloqueada quando em uso, e um formulário reutilizável que também servirá de pop-up nas Tasks 04/05.

---

## Definition of Ready (condições de início)

- [ ] Task 01 concluída (`useTheme`, `Screen`, `ThemedText`, `ThemedButton`).
- [ ] Task 02 concluída (`useCatalogStore`, `purchaseItem.repo`, `countListReferences`).

## Dependências
- Task 01, Task 02.

---

## Escopo

### Dentro do escopo
- Tela de catálogo (`app/catalog/index.tsx`): listar, criar, editar, excluir.
- Componente `IconPicker` (Material Icons).
- Componente `ColorPicker` (paleta fixa de cores de destaque).
- Componente **reutilizável** `PurchaseItemForm` (usado na tela e como pop-up nas próximas tasks).
- Validação de nome único e bloqueio de exclusão de item em uso.

### Fora do escopo
- Listas de compras (Task 04).
- Uso do form como pop-up dentro de uma lista (será **importado** na Task 04/05).

---

## Especificação técnica

### Dependências
```bash
# @expo/vector-icons já vem com Expo; garantir import de MaterialIcons
```

### Componente `IconPicker` (`src/components/common/IconPicker.tsx`)
- Props: `value: string`, `onChange: (icon: string) => void`.
- Exibe um grid de ícones Material selecionáveis (curar uma lista de ~40–60 nomes comuns de compras: `shopping-cart`, `local-grocery-store`, `restaurant`, `local-drink`, `egg`, `bakery-dining`, etc.).
- Campo de busca opcional por nome.
- Destaca o ícone selecionado.

### Componente `ColorPicker` (`src/components/common/ColorPicker.tsx`)
- Props: `value: string`, `onChange: (hex: string) => void`.
- Paleta fixa (ex.: 12 cores em hex). Destaca a selecionada.

### Componente `PurchaseItemForm` (`src/components/catalog/PurchaseItemForm.tsx`)
- Props: `initial?: PurchaseItem`, `onSubmit: (data) => Promise<void>`, `onCancel?: () => void`.
- Campos: `name` (obrigatório), `highlightColor` (ColorPicker), `icon` (IconPicker).
- Validações:
  - `name` não vazio (trim).
  - `name` único (consultar `useCatalogStore`/repo; case-insensitive). Em modo edição, ignorar o próprio id.
- Exibe mensagens de erro inline.
- **Reutilizável**: não deve assumir que está numa tela cheia; funciona dentro de um modal também.

### Componente `PurchaseItemCard` (`src/components/catalog/PurchaseItemCard.tsx`)
- Mostra ícone (com `highlightColor`) + nome.
- Ações: editar e excluir.

### Tela `app/catalog/index.tsx`
- Lista todos os itens (ordenados por nome).
- Botão "Adicionar item" abre o `PurchaseItemForm` (modal).
- Editar abre o form preenchido.
- Excluir:
  - Antes de excluir, chamar `countListReferences(id)`.
  - Se `> 0`: **bloquear** e mostrar aviso ("Item está em uso em N lista(s) e não pode ser excluído").
  - Se `0`: confirmar e excluir.
- Empty state quando não há itens.

---

## Regras de negócio envolvidas
- **RN-02:** `name` obrigatório e único (case-insensitive). Exclusão **bloqueada** se item estiver em uso.
- **RN-05 (preparação):** o `PurchaseItemForm` precisa ser reutilizável como pop-up.

---

## Definition of Done (condições de fim)

- [ ] É possível criar item com nome, cor e ícone.
- [ ] Nome duplicado (mesmo com caixa diferente) é bloqueado com mensagem.
- [ ] É possível editar um item existente.
- [ ] Excluir item **não** usado funciona (com confirmação).
- [ ] Excluir item **em uso** é bloqueado com aviso.
- [ ] Lista ordenada alfabeticamente; empty state presente.
- [ ] `IconPicker`, `ColorPicker`, `PurchaseItemForm` são componentes independentes e reutilizáveis.
- [ ] `npx tsc --noEmit` e `npx eslint .` passam; testes (se houver) passam.

## Como validar
```bash
npx tsc --noEmit
npx eslint .
npx expo start
# 1. Criar 3 itens; tentar criar um com nome repetido (caixa diferente) -> bloqueado.
# 2. Editar um item.
# 3. Excluir um item não usado -> ok.
# (Validação de exclusão bloqueada será testável de fato após a Task 04.)
```

## Sugestão de commit
```
feat: purchase item catalog crud with icon/color pickers and reusable form
```

## Entrega para a próxima task
Task 04 importará `PurchaseItemForm` para o pop-up "Adicionar Novo Item" e usará `useCatalogStore` para listar itens.
