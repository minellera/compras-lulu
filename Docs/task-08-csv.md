# Task 08 — Importação / Exportação CSV

> **Objetivo:** Implementar o compartilhamento de listas de compras via arquivo CSV (uma lista por arquivo): exportar e compartilhar; importar reconstruindo a lista e **cadastrando automaticamente** os itens de catálogo que ainda não existirem no dispositivo importador. As opções ficam no menu lateral (tela `data-transfer`).

---

## Definition of Ready (condições de início)

- [ ] Task 03 concluída (catálogo + `useCatalogStore` + criação de item).
- [ ] Task 04 concluída (listas com itens).
- [ ] Task 05 concluída (estrutura completa da lista, incl. status/itens).

## Dependências
- Task 03, Task 04, Task 05.

---

## Escopo

### Dentro do escopo
- Service de CSV (`csv.service.ts`): gerar e parsear.
- Exportação: selecionar uma lista, gerar `.csv`, compartilhar.
- Importação: selecionar `.csv`, validar, reconstruir lista, auto-cadastrar itens novos.
- Tela `app/data-transfer/index.tsx` com as duas ações.

### Fora do escopo
- Exportar/importar lista de desejos (não requisitado).
- Múltiplas listas no mesmo arquivo (decisão fixada: **uma lista por arquivo**).

---

## Especificação técnica

### Dependências
```bash
npx expo install expo-file-system expo-sharing expo-document-picker
npm i papaparse
npm i -D @types/papaparse
```

### Formato do CSV (achatado — uma linha por item)
Cabeçalho fixo (UTF-8):
```
list_title,list_description,item_name,item_icon,item_color,quantity,quantity_type,in_cart
```
- Uma linha por `ShoppingListItem`.
- `list_title` e `list_description` repetem em todas as linhas da mesma lista.
- `quantity_type` ∈ `unit|weight|volume`.
- `in_cart` ∈ `true|false`.
- Usar `papaparse` (`unparse`/`parse`) para lidar com vírgulas, aspas e acentos.

> **Observação sobre status:** ao exportar, exportar apenas a estrutura de itens; ao importar, a lista nasce como **`open`** (não importar `totalValue`/`completedAt`). Itens importados nascem com `in_cart` conforme o CSV (ou forçar `false` — **decisão:** respeitar o valor do CSV).

### Service (`src/services/csv.service.ts`)
```ts
exportListToCsv(list: ShoppingList, catalog: PurchaseItem[]): string
// monta as linhas resolvendo nome/ícone/cor de cada item via catálogo

parseCsvToImport(content: string): ParsedImport
// valida cabeçalho e linhas; retorna { listTitle, listDescription, rows[] } ou erros
```
- `parseCsvToImport` deve validar colunas obrigatórias e reportar linhas inválidas sem abortar tudo (pular e coletar erros).

### Fluxo de exportação
1. Tela `data-transfer`: botão "Exportar lista" → seletor das listas existentes (escolher **uma**).
2. `exportListToCsv` gera a string.
3. `expo-file-system` grava `lista-<slug-do-titulo>.csv` em diretório de cache/documents.
4. `expo-sharing.shareAsync(uri)` abre a folha de compartilhamento.

### Fluxo de importação (RN-13 — crítico)
1. Botão "Importar lista" → `expo-document-picker` (filtrar `.csv`/text).
2. Ler conteúdo com `expo-file-system`.
3. `parseCsvToImport` valida.
4. Para cada linha, resolver o `PurchaseItem`:
   - Normalizar `item_name` (trim + lowercase) e buscar via `useCatalogStore`/`getByName`.
   - **Se não existir → criar** `PurchaseItem` com `name` (original), `icon` e `highlightColor` do CSV, **imediatamente**.
   - Se existir → reutilizar (não duplicar; manter ícone/cor já cadastrados do importador).
5. Montar `ShoppingListItem[]` com `purchaseItemId`, `quantity`, `quantityType`, `inCart`.
6. Criar uma **nova** `ShoppingList` (`status: 'open'`, novo `id`) via `useShoppingStore.create`.
7. Feedback ao usuário: nº de itens importados, nº de itens de catálogo criados, e linhas com erro (se houver).

### Tela `app/data-transfer/index.tsx`
- Dois blocos: "Exportar lista" e "Importar lista".
- Mensagens de sucesso/erro claras.

### Testes (`__tests__/csv.service.test.ts`) — obrigatórios
- `exportListToCsv` produz cabeçalho correto e uma linha por item.
- Round-trip: exportar → parsear retorna os mesmos dados lógicos.
- `parseCsvToImport` rejeita CSV com cabeçalho faltando.
- `parseCsvToImport` pula linha inválida e reporta erro, sem abortar o resto.

---

## Regras de negócio envolvidas
- **RN-12:** exportação de lista para CSV e compartilhamento.
- **RN-13:** importação reconstrói a lista; itens inexistentes são **cadastrados imediatamente**; existentes são reutilizados; lista importada nasce como nova (`open`).

---

## Definition of Done (condições de fim)

- [ ] Exportar uma lista gera `.csv` e abre o compartilhamento do SO.
- [ ] Importar um `.csv` cria uma nova lista (`open`) com os itens corretos.
- [ ] Itens de catálogo inexistentes no importador são criados automaticamente com ícone/cor do CSV.
- [ ] Itens já existentes são reutilizados (sem duplicar no catálogo).
- [ ] CSV malformado/colunas faltando → erro claro, sem corromper dados.
- [ ] Linhas inválidas são puladas e reportadas.
- [ ] Opções aparecem na tela do menu lateral `data-transfer`.
- [ ] Testes do `csv.service` passam.
- [ ] `npx tsc --noEmit` e `npx eslint .` passam.

## Como validar
```bash
npm test
npx tsc --noEmit
npx eslint .
npx expo start
# 1. Exportar uma lista; salvar/compartilhar o arquivo.
# 2. (Simular outra instância) limpar o catálogo OU usar um arquivo com itens novos.
# 3. Importar o CSV -> nova lista criada e itens novos cadastrados automaticamente.
# 4. Importar um CSV com cabeçalho errado -> erro claro.
```

## Sugestão de commit
```
feat: csv export/import for shopping lists with auto-registration of missing catalog items
```

## Entrega para a próxima task
Task 09 fará o polimento/QA final, incluindo revisão dos fluxos de CSV em dispositivo real.
