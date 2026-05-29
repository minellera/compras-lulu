import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDb } from './db';
import type { AppSettings } from '@/types';

const SINGLETON_ID = 'singleton';
const ASYNC_STORAGE_KEY = '@settings';

type SettingsRow = {
  id: string;
  theme: string;
  font_family: string;
};

const DEFAULT: AppSettings = { theme: 'white', fontFamily: 'Inter' };

function rowToEntity(row: SettingsRow): AppSettings {
  return {
    theme: row.theme as AppSettings['theme'],
    fontFamily: row.font_family as AppSettings['fontFamily'],
  };
}

export const settingsRepo = {
  async get(): Promise<AppSettings> {
    const db = getDb();
    let row = await db.getFirstAsync<SettingsRow>(
      'SELECT * FROM app_settings WHERE id = ?',
      [SINGLETON_ID]
    );

    if (!row) {
      // migrate from AsyncStorage (Task 01 temporary storage)
      let migrated: AppSettings = DEFAULT;
      try {
        const raw = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (raw) {
          migrated = JSON.parse(raw) as AppSettings;
          await AsyncStorage.removeItem(ASYNC_STORAGE_KEY);
        }
      } catch {}
      await settingsRepo.save(migrated);
      return migrated;
    }

    return rowToEntity(row);
  },

  async save(settings: AppSettings): Promise<void> {
    const db = getDb();
    await db.runAsync(
      'INSERT OR REPLACE INTO app_settings (id, theme, font_family) VALUES (?, ?, ?)',
      [SINGLETON_ID, settings.theme, settings.fontFamily]
    );
  },
};
