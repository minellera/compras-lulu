# 📦 Índice de Tasks — Compras da Lulu

Este diretório contém as tasks de implementação do app **Compras da Lulu** (React Native + Expo + TypeScript, 100% local, sem login/back-end).

Cada task é um arquivo **autossuficiente**: define o que precisa estar pronto antes de começar (Definition of Ready), o escopo, a especificação técnica, os arquivos a criar/editar, e o critério de conclusão (Definition of Done) com instruções de teste.

## Como usar (fluxo de trabalho com Claude Code)

1. Suba **um** arquivo de task por vez no projeto.
2. Peça ao Claude Code para implementar **somente aquela task**, respeitando o escopo "Fora do escopo".
3. Rode os comandos de validação listados em "Como validar".
4. Marque a checklist da "Definition of Done".
5. Faça commit (sugestão de mensagem no próprio arquivo) e passe para a próxima task.

## Ordem de execução e dependências

| # | Task | Arquivo | Depende de |
|---|---|---|---|
| 00 | Fundação do projeto e navegação | `task-00-fundacao.md` | — |
| 01 | Tema, fontes e configurações | `task-01-tema-fontes.md` | 00 |
| 02 | Persistência e repositórios | `task-02-persistencia.md` | 00 |
| 03 | Catálogo de itens de compra | `task-03-catalogo-itens.md` | 01, 02 |
| 04 | Listas de compras (criar/listar) | `task-04-listas-compras.md` | 02, 03 |
| 05 | Detalhe da lista + conclusão | `task-05-detalhe-conclusao.md` | 04 |
| 06 | Lista de desejos | `task-06-lista-desejos.md` | 01, 02 |
| 07 | Dashboard | `task-07-dashboard.md` | 04, 06 |
| 08 | Importação / Exportação CSV | `task-08-csv.md` | 03, 04, 05 |
| 09 | Polimento, acessibilidade e QA | `task-09-polimento-qa.md` | todas |

> Tasks 02 e 01 podem ser feitas em paralelo após a 00. A task 06 pode ser feita em paralelo com a 04/05 (ambas dependem de 01 e 02).

## Convenções globais (valem para todas as tasks)

- **Linguagem:** TypeScript em modo `strict`. Sem `any` implícito.
- **IDs:** UUID em `string` (use `expo-crypto` ou `nanoid`).
- **Datas:** ISO 8601 (`new Date().toISOString()`).
- **Dinheiro:** `number` em reais com 2 casas; arredondar com helper único (`utils/money.ts`).
- **Acesso a dados:** telas **nunca** acessam storage direto — sempre via stores (`zustand`) → repositories.
- **Estilo:** componentes consomem **tokens de tema** (nunca cores hard-coded).
- **Commits:** convencionais (`feat:`, `fix:`, `test:`, `chore:`).
- **Não introduzir back-end nem login** em nenhuma hipótese.

## Decisões de projeto já fixadas (para remover ambiguidade)

1. **Persistência:** `expo-sqlite` por trás de uma camada de repositório abstrata.
2. **Exclusão de item de catálogo em uso:** **bloquear** com aviso enquanto houver vínculo em qualquer lista.
3. **Importação de lista:** sempre criada como **nova lista** (novo `id`); nunca sobrescreve existente.
4. **CSV:** **uma lista por arquivo** (formato achatado, uma linha por item).
