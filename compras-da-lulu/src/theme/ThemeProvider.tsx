import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSettings, FontName, ThemeName } from '@/types';
import { themes, type ThemeTokens } from './themes';
import { fontFamilyMap } from './fonts';

const STORAGE_KEY = '@settings';
const DEFAULT_SETTINGS: AppSettings = { theme: 'white', fontFamily: 'Inter' };

interface ThemeContextValue {
  tokens: ThemeTokens;
  fontFamily: string;
  settings: AppSettings;
  setTheme: (t: ThemeName) => void;
  setFont: (f: FontName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setSettings(JSON.parse(raw) as AppSettings);
        } catch {}
      }
    });
  }, []);

  const persist = (next: AppSettings) => {
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <ThemeContext.Provider
      value={{
        tokens: themes[settings.theme],
        fontFamily: fontFamilyMap[settings.fontFamily],
        settings,
        setTheme: (theme) => persist({ ...settings, theme }),
        setFont: (fontFamily) => persist({ ...settings, fontFamily }),
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
