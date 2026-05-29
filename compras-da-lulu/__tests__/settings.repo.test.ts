import { settingsRepo } from '@/repositories/settings.repo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockDb = {
  execAsync: jest.fn().mockResolvedValue(undefined),
  runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 0, changes: 1 }),
  getFirstAsync: jest.fn(),
  getAllAsync: jest.fn(),
  withTransactionAsync: jest.fn((fn: () => Promise<void>) => fn()),
};

jest.mock('@/repositories/db', () => ({
  getDb: () => mockDb,
  initDb: jest.fn().mockResolvedValue(mockDb),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('settingsRepo.get', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 1 });
  });

  it('returns default settings when database is empty and AsyncStorage has nothing', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const settings = await settingsRepo.get();

    expect(settings).toEqual({ theme: 'white', fontFamily: 'Inter' });
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO app_settings'),
      expect.arrayContaining(['singleton', 'white', 'Inter'])
    );
  });

  it('returns existing settings from database', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 'singleton',
      theme: 'blue',
      font_family: 'Poppins',
    });

    const settings = await settingsRepo.get();

    expect(settings).toEqual({ theme: 'blue', fontFamily: 'Poppins' });
    expect(mockDb.runAsync).not.toHaveBeenCalled();
  });

  it('migrates settings from AsyncStorage when database is empty', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({ theme: 'green', fontFamily: 'Nunito' })
    );

    const settings = await settingsRepo.get();

    expect(settings).toEqual({ theme: 'green', fontFamily: 'Nunito' });
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@settings');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO app_settings'),
      expect.arrayContaining(['singleton', 'green', 'Nunito'])
    );
  });
});

describe('settingsRepo.save', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 1 });
  });

  it('persists settings to the database', async () => {
    await settingsRepo.save({ theme: 'purple', fontFamily: 'Lato' });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO app_settings'),
      ['singleton', 'purple', 'Lato']
    );
  });
});
