# Task 06 — Lista de Desejos

> **Objetivo:** Implementar o CRUD de itens de desejo (`WishItem`) com foto, valor, link, ícone e cor de fundo; marcar como adquirido (toque) com pop-up de parabéns e opção de atualizar a foto; seção separada para adquiridos; e edição via toque longo (long-press).

---

## Definition of Ready (condições de início)

- [ ] Task 01 concluída (tema, componentes base).
- [ ] Task 02 concluída (`useWishStore`, `wishItem.repo`).

## Dependências
- Task 01, Task 02. (Independente das Tasks 03–05.)

---

## Escopo

### Dentro do escopo
- Tela `app/wishlist/index.tsx`: listar desejos; seção "Não adquiridos" no topo e "Adquiridos" abaixo.
- Botão no topo para cadastrar novo desejo.
- Formulário `WishItemForm` com todos os campos, incluindo foto (câmera/galeria) e cor de fundo.
- Marcar como adquirido (toque) + pop-up de parabéns + opção de atualizar foto.
- Long-press para editar.

### Fora do escopo
- Dashboard (Task 07) — apenas consumirá os 3 mais recentes.
- CSV (não se aplica a desejos neste escopo).

---

## Especificação técnica

### Dependências
```bash
npx expo install expo-image-picker expo-file-system
```
- Configurar permissões de câmera/galeria no `app.json` (mensagens de uso para iOS).

### Componente `WishItemForm` (`src/components/wishlist/WishItemForm.tsx`)
- Props: `initial?: WishItem`, `onSubmit`, `onCancel?`.
- Campos:
  - `name` (obrigatório),
  - `description` (opcional),
  - `priceBRL` (número ≥ 0, parse de moeda),
  - `icon` (reusar `IconPicker` da Task 03),
  - `purchaseLink` (opcional; se preenchido, validar formato de URL),
  - `photoUri` (botão para escolher câmera/galeria via `expo-image-picker`; salvar o arquivo em diretório persistente com `expo-file-system` e guardar o caminho),
  - `backgroundColor` (reusar `ColorPicker` da Task 03).
- Validações inline.

### Componente `WishCard` (`src/components/wishlist/WishCard.tsx`)
- Card com `backgroundColor` do item, foto (se houver) ou ícone, nome, valor (`formatBRL`), e link (abre no navegador ao tocar no link).
- Gestos:
  - **Toque (onPress):** marcar como adquirido (se ainda não for).
  - **Long-press (onLongPress):** abrir edição (`WishItemForm` preenchido).
- Aparência diferente quando `acquired === true` (ex.: selo "Adquirido").

### Tela `app/wishlist/index.tsx`
- Botão no topo: "Adicionar item de desejo" (abre `WishItemForm` em modal).
- Seções: **Não adquiridos** (topo) e **Adquiridos** (abaixo, separados visualmente). Dentro de cada seção ordenar por `createdAt` desc.
- Empty state.

### Fluxo "marcar como adquirido" (RN-10)
1. Toque em um item não adquirido chama `useWishStore.markAcquired(id)` → `acquired = true`, `acquiredAt = nowIso()`.
2. Exibir **pop-up de parabéns**: mensagem comemorativa + pergunta "Quer guardar este momento atualizando a foto?".
   - "Sim" → abre `expo-image-picker` → atualiza `photoUri`.
   - "Agora não" → fecha.
3. O item migra para a seção "Adquiridos".

---

## Regras de negócio envolvidas
- **RN-09:** campos do item de desejo; `acquired = false` por padrão; URL validada se preenchida.
- **RN-10:** toque marca adquirido → pop-up de parabéns + opção de foto; adquiridos em seção separada.
- **RN-11:** long-press abre edição.

---

## Definition of Done (condições de fim)

- [ ] Criar desejo com todos os campos, incluindo foto e cor de fundo.
- [ ] Link inválido é rejeitado; link válido abre no navegador.
- [ ] Toque em item não adquirido → pop-up de parabéns + opção de atualizar foto.
- [ ] Após adquirir, item vai para a seção "Adquiridos".
- [ ] Long-press abre a edição do item.
- [ ] Foto persiste (caminho salvo) após reabrir o app.
- [ ] Empty state presente; ordenação por `createdAt` desc em cada seção.
- [ ] `npx tsc --noEmit` e `npx eslint .` passam; testes (se houver) passam.

## Como validar
```bash
npx tsc --noEmit
npx eslint .
npx expo start
# 1. Criar desejo com foto da galeria e cor de fundo.
# 2. Tocar no item -> pop-up de parabéns -> atualizar foto.
# 3. Confirmar que foi para "Adquiridos".
# 4. Long-press em um item -> editar.
# 5. Reabrir app -> dados e foto persistidos.
```

## Sugestão de commit
```
feat: wishlist crud with photo, acquire celebration popup and long-press edit
```

## Entrega para a próxima task
Task 07 (Dashboard) exibirá os 3 `WishItem` mais recentes (`createdAt` desc).
