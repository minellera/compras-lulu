import { rowToEntity, purchaseItemRepo } from '@/repositories/purchaseItem.repo';
import type { PurchaseItem } from '@/types';

// Mock nanoid to get deterministic IDs
jest.mock('nanoid', () => ({ nanoid: () => 'test-id-001' }));

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

describe('rowToEntity', () => {
  it('maps snake_case row to camelCase PurchaseItem', () => {
    const row = {
      id: 'abc-123',
      name: 'Maçã',
      highlight_color: '#FF0000',
      icon: 'apple',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z',
    };

    const entity = rowToEntity(row);

    expect(entity).toEqual<PurchaseItem>({
      id: 'abc-123',
      name: 'Maçã',
      highlightColor: '#FF0000',
      icon: 'apple',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    });
  });
});

describe('purchaseItemRepo.getAll', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns empty array when no rows exist', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([]);
    const result = await purchaseItemRepo.getAll();
    expect(result).toEqual([]);
  });

  it('returns mapped entities from rows', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([
      { id: '1', name: 'Leite', highlight_color: '#FFF', icon: 'milk', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
    ]);
    const result = await purchaseItemRepo.getAll();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Leite');
    expect(result[0].highlightColor).toBe('#FFF');
  });
});

describe('purchaseItemRepo.create', () => {
  beforeEach(() => jest.clearAllMocks());

  it('inserts into db and returns the created entity', async () => {
    const result = await purchaseItemRepo.create({
      name: 'Banana',
      highlightColor: '#FFE135',
      icon: 'nutrition',
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO purchase_items'),
      expect.arrayContaining(['Banana', '#FFE135', 'nutrition'])
    );
    expect(result.name).toBe('Banana');
    expect(result.id).toBe('test-id-001');
  });

  it('propagates UNIQUE constraint error for duplicate names', async () => {
    mockDb.runAsync.mockRejectedValueOnce(
      new Error('UNIQUE constraint failed: purchase_items.name')
    );

    await expect(
      purchaseItemRepo.create({ name: 'Maçã', highlightColor: '#F00', icon: 'apple' })
    ).rejects.toThrow('UNIQUE constraint failed');
  });
});

describe('purchaseItemRepo.countListReferences', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the count of references in shopping_list_items', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ cnt: 3 });
    const count = await purchaseItemRepo.countListReferences('item-id-1');
    expect(count).toBe(3);
  });

  it('returns 0 when item is not referenced', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ cnt: 0 });
    const count = await purchaseItemRepo.countListReferences('item-id-2');
    expect(count).toBe(0);
  });
});
