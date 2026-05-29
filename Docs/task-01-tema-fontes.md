# Task 01 — Tema, Fontes e Configurações

> **Objetivo:** Implementar o sistema de personalização: 8 temas de cor, 5 fontes do Google, um `ThemeProvider` global, componentes base (`Text`, `Button`, `Screen`) que consomem tokens, e a tela de Configurações para trocar tema/fonte com persistência.

---

## Definition of Ready (condições de início)

- [ ] Task 00 concluída (estrutura, navegação e tipos existem).
- [ ] Tipos `ThemeName`, `FontName`, `AppSettings` disponíveis em `src/types`.

## Dependências
- Task 00.

---

## Escopo

### Dentro do escopo
- Tokens de tema para as 8 cores.
- Carregamento de 5 fontes do Google Fonts.
- `ThemeProvider` (Context) + hook `useTheme()`.
- Componentes base: `ThemedText`, `ThemedButton`, `Screen`.
- Tela de Configurações: seleção de tema e fonte.
- Persistência **simples** das settings (AsyncStorage nesta task — a migração para repositório/SQLite vem na Task 02; aqui basta funcionar e persistir).

### Fora do escopo
- CRUD das demais entidades.
- SQLite (Task 02). Aqui pode usar AsyncStorage diretamente para settings; a Task 02 unifica isso.

---

## Especificação técnica

### Dependências
```bash
npx expo install expo-font @expo-google-fonts/inter @expo-google-fonts/roboto \
  @expo-google-fonts/poppins @expo-google-fonts/nunito @expo-google-fonts/lato \
  @react-native-async-storage/async-storage
```

### Tokens de tema (`src/theme/themes.ts`)
Definir interface e os 8 temas. Cada tema deve garantir **contraste legível**.
```ts
export interface ThemeTokens {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  border: string;
  success: string;
  danger: string;
}
export const themes: Record<ThemeName, ThemeTokens> = {
  white:  { /* fundo claro, texto escuro */ },
  black:  { /* fundo escuro, texto claro */ },
  green:  { /* primary verde */ },
  red:    { /* primary vermelho */ },
  pink:   { /* primary rosa */ },
  yellow: { /* atenção ao contraste do texto */ },
  purple: { /* primary roxo */ },
  blue:   { /* primary azul */ },
};
```
> Cada tema define `primary` como sua cor característica; `white` e `black` definem o modo claro/escuro de base. Garanta que `text` sobre `background` e sobre `surface` tenha contraste adequado (WCAG AA sempre que possível).

### Fontes (`src/theme/fonts.ts`)
Mapear `FontName` → família carregada via `useFonts`. Carregar no `_layout.tsx` raiz e exibir splash/placeholder enquanto carrega.

### ThemeProvider (`src/theme/ThemeProvider.tsx`)
- Estado: `settings: AppSettings` (default: `{ theme: 'white', fontFamily: 'Inter' }`).
- Carrega settings persistidas no boot.
- Expõe: `tokens` (tokens do tema atual), `fontFamily`, `setTheme(t)`, `setFont(f)`.
- `setTheme`/`setFont` persistem imediatamente (AsyncStorage chave `@settings`).
- Hook `useTheme()` para consumo.

### Componentes base (`src/components/common/`)
- `ThemedText`: `Text` que aplica `color: tokens.text` e `fontFamily` ativa. Aceita prop `variant` (`title | body | muted`).
- `ThemedButton`: botão com `backgroundColor: tokens.primary`, texto contrastante, estados `disabled`/`loading`.
- `Screen`: wrapper com `SafeAreaView` + `backgroundColor: tokens.background` + padding padrão.

### Tela de Configurações (`app/settings/index.tsx`)
- Seletor de **tema**: 8 amostras (swatches) clicáveis; destaca o ativo.
- Seletor de **fonte**: lista das 5 fontes, cada item renderizado **na própria fonte**; destaca a ativa.
- Mudanças aplicam-se imediatamente em todo o app.

### Integração global
- Envolver o app inteiro com `ThemeProvider` no `app/_layout.tsx`.

---

## Regras de negócio envolvidas
- **RN-14:** tema e fonte são persistidos e aplicados globalmente de imediato.

---

## Definition of Done (condições de fim)

- [ ] As 8 cores de tema funcionam e mudam o app inteiro.
- [ ] As 5 fontes carregam e a fonte ativa é aplicada globalmente.
- [ ] Trocar tema/fonte e **reabrir o app** mantém a escolha (persistência).
- [ ] `ThemedText`, `ThemedButton`, `Screen` existem e são usados na tela de Configurações.
- [ ] Nenhuma cor hard-coded nos componentes base (somente tokens).
- [ ] `npx tsc --noEmit` e `npx eslint .` passam.

## Como validar
```bash
npx tsc --noEmit
npx eslint .
npx expo start
# 1. Trocar para cada um dos 8 temas e verificar contraste do texto.
# 2. Trocar para cada uma das 5 fontes.
# 3. Fechar e reabrir o app: a escolha deve persistir.
```

## Sugestão de commit
```
feat: theming system with 8 color themes, 5 google fonts and settings screen
```

## Entrega para a próxima task
Tasks seguintes assumem que `useTheme()`, `Screen`, `ThemedText`, `ThemedButton` existem e que toda UI deve usar tokens.
