import { getDb } from './db';
import { newId } from '@/utils/uuid';
import { nowIso } from '@/utils/date';
import type { ShoppingList, ShoppingListItem, ListStatus, QuantityType } from '@/types';

type ListRow = {
  id: string;
  title: string;
  description: string;
  status: string;
  total_value: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // joined item columns (nullable when no items)
  item_id: string | null;
  purchase_item_id: string | null;
  quantity: number | null;
  quantity_type: string | null;
  in_cart: number | null;
};

function rowsToEntities(rows: ListRow[]): ShoppingList[] {
  const map = new Map<string, ShoppingList>();

  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status as ListStatus,
        totalValue: row.total_value,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        items: [],
      });
    }

    if (row.item_id) {
      const item: ShoppingListItem = {
        id: row.item_id,
        purchaseItemId: row.purchase_item_id!,
        quantity: row.quantity!,
        quantityType: row.quantity_type as QuantityType,
        inCart: row.in_cart === 1,
      };
      map.get(row.id)!.items.push(item);
    }
  }

  return Array.from(map.values());
}

const SELECT_WITH_ITEMS = `
  SELECT
    sl.id, sl.title, sl.description, sl.status,
    sl.total_value, sl.completed_at, sl.created_at, sl.updated_at,
    sli.id          AS item_id,
    sli.purchase_item_id,
    sli.quantity,
    sli.quantity_type,
    sli.in_cart
  FROM shopping_lists sl
  LEFT JOIN shopping_list_items sli ON sli.list_id = sl.id
`;

async function persistItems(
  db: Awaited<ReturnType<typeof getDb>>,
  listId: string,
  items: ShoppingListItem[]
): Promise<void> {
  await db.runAsync('DELETE FROM shopping_list_items WHERE list_id = ?', [listId]);
  for (const item of items) {
    await db.runAsync(
      'INSERT INTO shopping_list_items (id, list_id, purchase_item_id, quantity, quantity_type, in_cart) VALUES (?, ?, ?, ?, ?, ?)',
      [item.id, listId, item.purchaseItemId, item.quantity, item.quantityType, item.inCart ? 1 : 0]
    );
  }
}

export const shoppingListRepo = {
  async getAll(): Promise<ShoppingList[]> {
    const db = getDb();
    const rows = await db.getAllAsync<ListRow>(
      SELECT_WITH_ITEMS + 'ORDER BY sl.created_at DESC, sli.id'
    );
    return rowsToEntities(rows);
  },

  async getById(id: string): Promise<ShoppingList | null> {
    const db = getDb();
    const rows = await db.getAllAsync<ListRow>(
      SELECT_WITH_ITEMS + 'WHERE sl.id = ? ORDER BY sli.id',
      [id]
    );
    const entities = rowsToEntities(rows);
    return entities[0] ?? null;
  },

  async create(
    data: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ShoppingList> {
    const db = getDb();
    const entity: ShoppingList = {
      ...data,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      items: data.items.map((it) => ({ ...it, id: it.id || newId() })),
    };

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'INSERT INTO shopping_lists (id, title, description, status, total_value, completed_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [entity.id, entity.title, entity.description, entity.status, entity.totalValue ?? null, entity.completedAt ?? null, entity.createdAt, entity.updatedAt]
      );
      await persistItems(db, entity.id, entity.items);
    });

    return entity;
  },

  async update(
    id: string,
    patch: Partial<Omit<ShoppingList, 'id' | 'createdAt'>>
  ): Promise<ShoppingList> {
    const db = getDb();
    const existing = await shoppingListRepo.getById(id);
    if (!existing) throw new Error(`ShoppingList ${id} not found`);
    const updated: ShoppingList = { ...existing, ...patch, updatedAt: nowIso() };

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        'UPDATE shopping_lists SET title = ?, description = ?, status = ?, total_value = ?, completed_at = ?, updated_at = ? WHERE id = ?',
        [updated.title, updated.description, updated.status, updated.totalValue ?? null, updated.completedAt ?? null, updated.updatedAt, updated.id]
      );
      if (patch.items) {
        await persistItems(db, updated.id, updated.items);
      }
    });

    return updated;
  },

  async remove(id: string): Promise<void> {
    const db = getDb();
    await db.runAsync('DELETE FROM shopping_lists WHERE id = ?', [id]);
  },
};
