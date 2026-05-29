import { shoppingListRepo } from '@/repositories/shoppingList.repo';

jest.mock('nanoid', () => ({ nanoid: () => 'test-id-002' }));

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

describe('shoppingListRepo.getAll — hydrated items', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns empty array when no lists exist', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([]);
    const result = await shoppingListRepo.getAll();
    expect(result).toEqual([]);
  });

  it('returns a list with its items hydrated', async () => {
    const rows = [
      {
        id: 'list-1',
        title: 'Semana 1',
        description: '',
        status: 'open',
        total_value: null,
        completed_at: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
        item_id: 'item-1',
        purchase_item_id: 'pi-1',
        quantity: 2,
        quantity_type: 'unit',
        in_cart: 0,
      },
      {
        id: 'list-1',
        title: 'Semana 1',
        description: '',
        status: 'open',
        total_value: null,
        completed_at: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
        item_id: 'item-2',
        purchase_item_id: 'pi-2',
        quantity: 1.5,
        quantity_type: 'weight',
        in_cart: 1,
      },
    ];
    mockDb.getAllAsync.mockResolvedValueOnce(rows);

    const lists = await shoppingListRepo.getAll();

    expect(lists).toHaveLength(1);
    expect(lists[0].title).toBe('Semana 1');
    expect(lists[0].items).toHaveLength(2);
    expect(lists[0].items[0]).toMatchObject({ id: 'item-1', quantity: 2, quantityType: 'unit', inCart: false });
    expect(lists[0].items[1]).toMatchObject({ id: 'item-2', quantity: 1.5, quantityType: 'weight', inCart: true });
  });

  it('deduplicates lists correctly when multiple rows share the same list id', async () => {
    const rows = [
      { id: 'l1', title: 'A', description: '', status: 'open', total_value: null, completed_at: null, created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z', item_id: 'i1', purchase_item_id: 'pi1', quantity: 1, quantity_type: 'unit', in_cart: 0 },
      { id: 'l2', title: 'B', description: '', status: 'completed', total_value: 50, completed_at: '2024-01-02T00:00:00.000Z', created_at: '2024-01-02T00:00:00.000Z', updated_at: '2024-01-02T00:00:00.000Z', item_id: null, purchase_item_id: null, quantity: null, quantity_type: null, in_cart: null },
    ];
    mockDb.getAllAsync.mockResolvedValueOnce(rows);

    const lists = await shoppingListRepo.getAll();

    expect(lists).toHaveLength(2);
    expect(lists[0].items).toHaveLength(1);
    expect(lists[1].items).toHaveLength(0); // no items (LEFT JOIN returned null)
    expect(lists[1].status).toBe('completed');
  });
});

describe('shoppingListRepo.create', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates list and items in a transaction', async () => {
    const result = await shoppingListRepo.create({
      title: 'Feira',
      description: '',
      status: 'open',
      totalValue: null,
      completedAt: null,
      items: [
        { id: 'existing-item-id', purchaseItemId: 'pi-1', quantity: 3, quantityType: 'unit', inCart: false },
      ],
    });

    expect(mockDb.withTransactionAsync).toHaveBeenCalled();
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO shopping_lists'),
      expect.anything()
    );
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO shopping_list_items'),
      expect.anything()
    );
    expect(result.title).toBe('Feira');
    expect(result.items).toHaveLength(1);
  });
});
