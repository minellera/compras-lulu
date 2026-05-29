# Task 04 — Listas de Compras (Criar e Listar)

> **Objetivo:** Implementar a tela de listagem de listas de compras (abertas no topo, concluídas abaixo), a criação/edição de lista (título, descrição, itens com quantidade e tipo) e o seletor de itens em ordem alfabética com a opção "Adicionar Novo Item" via pop-up — sem perder o progresso da lista.

---

## Definition of Ready (condições de início)

- [ ] Task 02 concluída (`useShoppingStore`, `useCatalogStore`).
- [ ] Task 03 concluída (`PurchaseItemForm` reutilizável, catálogo populável).

## Dependências
- Task 02, Task 03.

---

## Escopo

### Dentro do escopo
- Tela `app/shopping-lists/index.tsx`: lista todas as listas, abertas no topo e concluídas abaixo; botão "Criar nova lista".
- Tela/fluxo de criação e edição de lista (título + descrição + itens).
- Editor de itens da lista: cada item = `PurchaseItem` + `quantity` + `quantityType`.
- Seletor de itens (modal): lista o catálogo **em ordem alfabética** + opção "Adicionar Novo Item" (pop-up que reutiliza `PurchaseItemForm`) **sem perder o progresso**.
- Persistência via store.

### Fora do escopo
- Detalhe da lista com checkbox/carrinho e conclusão (Task 05).
- CSV (Task 08).

---

## Especificação técnica

### Componente `ShoppingListCard` (`src/components/shopping/ShoppingListCard.tsx`)
- Mostra título, descrição curta, nº de itens, status.
- Concluída: exibe `totalValue` formatado (`formatBRL`) e `completedAt`.
- Toque navega para o detalhe (`/shopping-lists/[id]`) — rota já existe da Task 00.

### Tela de listagem (`app/shopping-lists/index.tsx`)
- Botão fixo no topo: **"Criar nova lista de compras"**.
- Duas seções: **Abertas** (status `open`) no topo e **Concluídas** (`completed`) abaixo.
- Dentro de cada seção, ordenar por `updatedAt` desc.
- Empty state.

### Fluxo de criação/edição
Pode ser uma rota nova (ex.: `app/shopping-lists/new.tsx` e edição reutilizando) ou um modal. **Decisão:** criar rota `app/shopping-lists/edit.tsx` que aceita `id` opcional (novo quando ausente).
- Campos: `title` (obrigatório), `description` (opcional).
- Lista editável de itens, cada linha com:
  - nome do item (do catálogo, com ícone/cor),
  - input de `quantity`,
  - seletor de `quantityType` (`unit` | `weight` | `volume`),
  - remover item.
- Botão **"Adicionar item"** abre o **seletor de itens**.

### Componente `ItemPickerModal` (`src/components/shopping/ItemPickerModal.tsx`)
- Lista **todos os itens do catálogo em ordem alfabética**.
- No topo, opção **"Adicionar Novo Item"** que abre o `PurchaseItemForm` em um modal **sobreposto**; ao salvar, o novo item é criado no catálogo, aparece imediatamente na lista do seletor e pode ser selecionado — **sem fechar o editor da lista nem perder o que já foi preenchido** (RN-05).
- Selecionar um item adiciona um `ShoppingListItem` com `quantity` default `1` e `quantityType` default `unit`.
- Impedir adicionar duplicado o mesmo `purchaseItemId` (ou permitir e somar — **decisão:** impedir duplicado; se já existe, focar a linha existente).

### Validações (RN-04)
- `quantity > 0`.
- `unit`: apenas inteiros (rejeitar decimais).
- `weight`/`volume`: aceitam decimais (kg / litros).
- Mostrar erro inline; bloquear salvar se inválido.

### Persistência
- Salvar cria/atualiza a `ShoppingList` (com seus itens) via `useShoppingStore.create/update`.
- Novas listas nascem com `status: 'open'`, `totalValue: null`, `completedAt: null`.

---

## Regras de negócio envolvidas
- **RN-03:** abertas no topo, concluídas abaixo; ordenar por `updatedAt` desc dentro do grupo.
- **RN-04:** quantidade por tipo (unit inteiro; weight/volume decimais; > 0).
- **RN-05:** seletor alfabético + "Adicionar Novo Item" em pop-up sem perder progresso.

---

## Definition of Done (condições de fim)

- [ ] É possível criar uma lista com título, descrição e ≥ 1 item.
- [ ] O seletor lista o catálogo em ordem alfabética.
- [ ] "Adicionar Novo Item" cria item no catálogo via pop-up **sem fechar o editor** e **sem perder** título/descrição/itens já preenchidos.
- [ ] Quantidade valida por tipo (unit inteiro; weight/volume decimal; > 0).
- [ ] Listagem mostra abertas no topo e concluídas abaixo, ordenadas por `updatedAt` desc.
- [ ] Tocar em um card navega ao detalhe (placeholder ou Task 05).
- [ ] Dados persistem após reabrir o app.
- [ ] `npx tsc --noEmit` e `npx eslint .` passam.

## Como validar
```bash
npx tsc --noEmit
npx eslint .
npx expo start
# 1. Criar lista, abrir seletor, usar "Adicionar Novo Item" no meio do preenchimento
#    -> confirmar que o progresso não se perde e o item novo aparece selecionável.
# 2. Tentar quantidade 0 ou decimal em 'unit' -> bloqueado.
# 3. Reabrir app -> lista persistida; abertas acima das concluídas.
```

## Sugestão de commit
```
feat: shopping lists creation/listing with alphabetical item picker and inline new-item popup
```

## Entrega para a próxima task
Task 05 abrirá `/shopping-lists/[id]` para detalhe com checkbox de carrinho e conclusão.
