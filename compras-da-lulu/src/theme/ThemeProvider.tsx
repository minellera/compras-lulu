import React, { createContext, useContext } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { themes, type ThemeTokens } from './themes';
import { fontFamilyMap } from './fonts';
import type { AppSettings, FontName, ThemeName } from '@/types';

interface ThemeContextValue {
  tokens: ThemeTokens;
  fontFamily: string;
  settings: AppSettings;
  setTheme: (t: ThemeName) => void;
  setFont: (f: FontName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, setTheme, setFont } = useSettingsStore();

  return (
    <ThemeContext.Provider
      value={{
        tokens: themes[settings.theme],
        fontFamily: fontFamilyMap[settings.fontFamily],
        settings,
        setTheme,
        setFont,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
