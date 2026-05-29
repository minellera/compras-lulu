# Task 05 — Detalhe da Lista, Carrinho e Conclusão

> **Objetivo:** Implementar a tela de detalhe de uma lista de compras: marcar itens no carrinho (checkbox), reordenação automática (marcados ao fim), botão "Adicionar novo item" (reusando o seletor), conclusão da compra com valor total, e ações de editar/excluir a lista.

---

## Definition of Ready (condições de início)

- [ ] Task 04 concluída (criação/listagem de listas, `ItemPickerModal`, `useShoppingStore`).

## Dependências
- Task 04.

---

## Escopo

### Dentro do escopo
- Tela `app/shopping-lists/[id].tsx`: detalhe completo.
- `ListItemRow` com checkbox (`inCart`).
- Reordenação: itens marcados descem para o fim.
- Botão "Adicionar novo item" (reusa `ItemPickerModal` da Task 04).
- Botão "Concluir compra" → pop-up de valor total → marca como concluída.
- Editar e excluir a lista (com confirmação).

### Fora do escopo
- CSV (Task 08).
- Dashboard (Task 07).

---

## Especificação técnica

### Componente `ListItemRow` (`src/components/shopping/ListItemRow.tsx`)
- Mostra ícone + nome (do `PurchaseItem` referenciado), quantidade + unidade legível (un / kg / L).
- **Checkbox** controla `inCart`.
- Estilo "riscado"/atenuado quando `inCart === true`.

### Tela de detalhe (`app/shopping-lists/[id].tsx`)
- Carregar a lista por `id` via `useShoppingStore`.
- Cabeçalho: título + descrição.
- **Ações no header:** editar (navega para o editor da Task 04 com o `id`) e excluir (confirmação destrutiva → remove e volta para a listagem).
- Lista de itens:
  - Não marcados no topo, marcados (`inCart`) ao fim (**RN-06**).
  - Ordenação estável e previsível; desmarcar retorna o item ao bloco de não marcados.
- Botão **"Adicionar novo item"**: abre o `ItemPickerModal` (mesmo da Task 04), adicionando itens à lista existente e persistindo.
- Botão **"Concluir compra"** (rodapé):
  - Abre pop-up solicitando **valor total** (obrigatório, número ≥ 0; usar `formatBRL`/parse).
  - Ao confirmar: `useShoppingStore.complete(id, totalValue)` → define `status: 'completed'`, `totalValue`, `completedAt = nowIso()`.
  - Após concluir: a lista sai do Dashboard (Task 07) e passa ao bloco "Concluídas" na listagem.
- Se a lista já estiver concluída: ocultar/("desabilitar") "Concluir compra" e mostrar valor total + data; permitir reabrir? **Decisão:** não permitir reabrir (manter simples); apenas exibir como concluída.

### Persistência de toggles
- Marcar/desmarcar `inCart` persiste imediatamente (atualiza `updatedAt`).

---

## Regras de negócio envolvidas
- **RN-06:** checkbox de carrinho; marcados descem ao fim; reordenação estável.
- **RN-07:** "Concluir compra" pede valor total e marca como concluída (`status`, `totalValue`, `completedAt`).
- **RN-08:** editar e excluir a lista; exclusão com confirmação.

---

## Definition of Done (condições de fim)

- [ ] Abrir uma lista mostra seus itens com checkbox.
- [ ] Marcar um item move-o para o fim; desmarcar retorna ao bloco de não marcados.
- [ ] Estado do carrinho persiste após reabrir o app.
- [ ] "Adicionar novo item" funciona no detalhe (reusa o seletor).
- [ ] "Concluir compra" pede valor total e marca a lista como concluída.
- [ ] Lista concluída exibe valor total e data; não reaparece como aberta.
- [ ] Editar e excluir (com confirmação) funcionam.
- [ ] `npx tsc --noEmit` e `npx eslint .` passam; testes (se houver) passam.

## Como validar
```bash
npx tsc --noEmit
npx eslint .
npx expo start
# 1. Abrir lista, marcar 2 itens -> descem ao fim; desmarcar -> voltam.
# 2. Reabrir app -> estado de carrinho mantido.
# 3. Concluir compra com valor -> lista vira "Concluída" na listagem.
# 4. Editar e excluir lista.
```

## Sugestão de commit
```
feat: shopping list detail with cart checkbox, reorder, completion and edit/delete
```

## Entrega para a próxima task
Task 07 (Dashboard) consumirá `status` para exibir só as abertas. Task 08 (CSV) exportará/importará listas completas.
