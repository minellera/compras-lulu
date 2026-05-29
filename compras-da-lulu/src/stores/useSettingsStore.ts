import { create } from 'zustand';
import { settingsRepo } from '@/repositories/settings.repo';
import type { AppSettings, FontName, ThemeName } from '@/types';

const DEFAULT: AppSettings = { theme: 'white', fontFamily: 'Inter' };

interface SettingsState {
  settings: AppSettings;
  load: () => Promise<void>;
  setTheme: (theme: ThemeName) => Promise<void>;
  setFont: (fontFamily: FontName) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT,

  load: async () => {
    const settings = await settingsRepo.get();
    set({ settings });
  },

  setTheme: async (theme) => {
    const next: AppSettings = { ...get().settings, theme };
    set({ settings: next });
    await settingsRepo.save(next);
  },

  setFont: async (fontFamily) => {
    const next: AppSettings = { ...get().settings, fontFamily };
    set({ settings: next });
    await settingsRepo.save(next);
  },
}));
