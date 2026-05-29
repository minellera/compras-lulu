# Task 07 — Dashboard

> **Objetivo:** Implementar a tela inicial (Dashboard) que mostra as listas de compras em aberto, os 3 itens de desejo mais recentes e os dois atalhos principais ("Lista de Compras" e "Lista de Desejos").

---

## Definition of Ready (condições de início)

- [ ] Task 04 concluída (listas existem, com `status`).
- [ ] Task 06 concluída (desejos existem, com `createdAt`).

## Dependências
- Task 04, Task 06.

---

## Escopo

### Dentro do escopo
- Tela `app/index.tsx` (Dashboard) com dados reais.
- Seção "Listas em aberto" (somente `status === 'open'`).
- Seção "Desejos recentes" (3 mais recentes por `createdAt` desc).
- Dois atalhos principais: "Lista de Compras" e "Lista de Desejos".

### Fora do escopo
- Criação/edição (já feita em tasks anteriores; Dashboard apenas navega).

---

## Especificação técnica

### Tela `app/index.tsx`
- Usar `useShoppingStore` e `useWishStore`.
- **Seção: Atalhos principais** — dois botões grandes/cards:
  - "Lista de Compras" → navega para `/shopping-lists`.
  - "Lista de Desejos" → navega para `/wishlist`.
- **Seção: Listas em aberto**
  - Filtrar `lists.filter(l => l.status === 'open')`.
  - Reusar `ShoppingListCard` (Task 04); tocar navega ao detalhe.
  - Empty state: "Nenhuma lista em aberto".
- **Seção: Desejos recentes**
  - `wishItems` ordenados por `createdAt` desc, pegar os **3 primeiros** (`slice(0, 3)`).
  - Reusar `WishCard` (Task 06) em modo compacto, ou um card simples; tocar navega para `/wishlist`.
  - Se houver menos de 3, mostrar os existentes; se 0, empty state.
- Atualizar ao voltar para a tela (recarregar dos stores / reagir a mudanças de estado).

---

## Regras de negócio envolvidas
- **RN-01:** Dashboard mostra apenas listas abertas e exatamente os 3 desejos mais recentes (ou menos, se não houver 3).

---

## Definition of Done (condições de fim)

- [ ] Dashboard exibe somente listas com `status === 'open'`.
- [ ] Dashboard exibe os 3 desejos mais recentes (ou menos, se houver menos).
- [ ] Atalhos "Lista de Compras" e "Lista de Desejos" navegam corretamente.
- [ ] Concluir uma compra (Task 05) faz a lista sumir do Dashboard.
- [ ] Adicionar um desejo o faz aparecer entre os recentes (se estiver entre os 3 últimos).
- [ ] Empty states presentes em ambas as seções.
- [ ] `npx tsc --noEmit` e `npx eslint .` passam.

## Como validar
```bash
npx tsc --noEmit
npx eslint .
npx expo start
# 1. Criar 2 listas abertas + 1 concluída -> só as 2 abertas aparecem.
# 2. Criar 4 desejos -> só os 3 mais recentes aparecem.
# 3. Concluir uma lista -> some do dashboard.
# 4. Testar os dois atalhos.
```

## Sugestão de commit
```
feat: dashboard with open lists, 3 recent wishes and main shortcuts
```

## Entrega para a próxima task
Task 08 (CSV) adiciona export/import; o Dashboard não muda, mas listas importadas devem refletir aqui.
