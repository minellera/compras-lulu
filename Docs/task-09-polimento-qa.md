# Task 09 — Polimento, Acessibilidade e QA Final

> **Objetivo:** Fechar o app para produção: estados vazios consistentes, validações e mensagens de erro, acessibilidade/contraste por tema, verificação cruzada de todas as regras de negócio, testes de regressão e checklist de aceite final.

---

## Definition of Ready (condições de início)

- [ ] Tasks 00 a 08 concluídas e mergeadas.
- [ ] App funcional ponta a ponta em emulador.

## Dependências
- Todas as tasks anteriores.

---

## Escopo

### Dentro do escopo
- Revisão de empty states em todas as telas.
- Revisão de validações e mensagens de erro.
- Acessibilidade: contraste por tema, `accessibilityLabel`, tamanhos de toque.
- Verificação cruzada das regras de negócio (RN-01 a RN-14).
- Testes de regressão e correção de bugs.
- Ajustes finos de UX (loading states, confirmações destrutivas, feedback).
- Preparação de build (ícone, splash, permissões, versão).

### Fora do escopo
- Novas funcionalidades além das já especificadas.

---

## Especificação técnica

### Estados vazios (empty states)
Garantir mensagem amigável + ação sugerida em:
- Dashboard (sem listas abertas / sem desejos).
- Lista de Compras (sem listas).
- Detalhe da lista (sem itens).
- Catálogo (sem itens).
- Lista de Desejos (sem itens, sem adquiridos).

### Validações e erros
- Todos os formulários bloqueiam submit inválido e mostram erro inline.
- Ações destrutivas (excluir lista/item/desejo) exigem confirmação.
- Falhas de I/O (foto, CSV) mostram mensagem amigável (não travar o app).

### Acessibilidade
- Verificar contraste de texto em **todos os 8 temas** (especial atenção a `yellow`, `white`, `black`).
- Adicionar `accessibilityLabel`/`accessibilityRole` em botões e itens interativos.
- Áreas de toque ≥ 44x44 pt.
- Garantir que long-press (desejos) tenha alternativa acessível (ex.: botão de editar visível ao tocar, se necessário).

### Performance/UX
- Loading states ao carregar stores no boot.
- Evitar re-render desnecessário em listas grandes (keys estáveis, memo onde fizer sentido).

### Build/config
- Definir `name`, `slug`, `version`, ícone e splash em `app.json`.
- Definir `ios.bundleIdentifier` e `android.package`.
- Strings de permissão (câmera/galeria) preenchidas.

### Testes de regressão (rodar e revisar)
- Rodar `npm test` (todos os testes das tasks anteriores devem passar).
- Executar a **matriz de testes manuais** abaixo.

---

## Verificação cruzada das Regras de Negócio

| RN | Descrição | Onde testar |
|---|---|---|
| RN-01 | Dashboard: abertas + 3 desejos recentes | Dashboard |
| RN-02 | Item de catálogo: nome único; exclusão bloqueada se em uso | Catálogo + lista |
| RN-03 | Listas: abertas no topo, concluídas abaixo | Lista de Compras |
| RN-04 | Quantidade por tipo (unit int; weight/volume decimal; >0) | Editor de lista |
| RN-05 | Seletor alfabético + "Adicionar Novo Item" sem perder progresso | Editor/Detalhe |
| RN-06 | Checkbox carrinho move item ao fim | Detalhe da lista |
| RN-07 | Concluir compra com valor total | Detalhe da lista |
| RN-08 | Editar/excluir lista com confirmação | Detalhe da lista |
| RN-09 | Campos do desejo; URL válida | Lista de Desejos |
| RN-10 | Adquirir → parabéns + atualizar foto; seção separada | Lista de Desejos |
| RN-11 | Long-press edita desejo | Lista de Desejos |
| RN-12 | Exportar CSV | Data Transfer |
| RN-13 | Importar CSV + auto-cadastro de itens | Data Transfer |
| RN-14 | Tema/fonte persistidos e globais | Configurações |

---

## Definition of Done (condições de fim)

- [ ] Todos os empty states presentes e claros.
- [ ] Todas as validações e confirmações destrutivas funcionando.
- [ ] Contraste verificado nos 8 temas; labels de acessibilidade nos elementos interativos.
- [ ] As 14 regras de negócio verificadas manualmente (tabela acima).
- [ ] `npm test` passa (sem testes quebrados).
- [ ] `npx tsc --noEmit` e `npx eslint .` passam sem erros nem warnings relevantes.
- [ ] `app.json` com ícone, splash, versão, identificadores e permissões.
- [ ] App testado em Android (emulador + físico, se possível) e iOS (simulador, se possível).
- [ ] Checklist de aceite final (abaixo) 100% marcado.

## Matriz de testes manuais (executar todos)

| Cenário | Esperado |
|---|---|
| Trocar tema e reabrir | Persiste |
| Trocar fonte e reabrir | Persiste |
| Item de catálogo com nome duplicado | Bloqueado |
| Excluir item de catálogo em uso | Bloqueado com aviso |
| Excluir item de catálogo livre | Excluído |
| "Adicionar Novo Item" no meio da criação da lista | Progresso preservado |
| Quantidade decimal em 'unit' | Bloqueado |
| Marcar item no carrinho | Desce ao fim; persiste |
| Concluir compra | Sai do dashboard; vira "Concluída" |
| Editar e excluir lista | Funciona com confirmação |
| Adquirir desejo | Parabéns + opção de foto; vai p/ "Adquiridos" |
| Long-press em desejo | Abre edição |
| Link de desejo inválido | Rejeitado |
| Exportar lista | Gera CSV e compartilha |
| Importar CSV com item novo | Lista criada + item cadastrado |
| Importar CSV malformado | Erro claro, sem corromper dados |
| Dashboard com 4 desejos | Mostra só os 3 mais recentes |

## Como validar
```bash
npm test
npx tsc --noEmit
npx eslint .
npx expo start    # percorrer toda a matriz manual acima
```

## Sugestão de commit
```
chore: final polishing, accessibility, qa and release config
```

## Entrega
App pronto para gerar build de produção (EAS) e publicar nas lojas.
