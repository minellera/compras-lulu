import { getDb } from './db';
import { newId } from '@/utils/uuid';
import { nowIso } from '@/utils/date';
import type { PurchaseItem } from '@/types';

type PurchaseItemRow = {
  id: string;
  name: string;
  highlight_color: string;
  icon: string;
  created_at: string;
  updated_at: string;
};

export function rowToEntity(row: PurchaseItemRow): PurchaseItem {
  return {
    id: row.id,
    name: row.name,
    highlightColor: row.highlight_color,
    icon: row.icon,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function entityToRow(entity: PurchaseItem): PurchaseItemRow {
  return {
    id: entity.id,
    name: entity.name,
    highlight_color: entity.highlightColor,
    icon: entity.icon,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}

export const purchaseItemRepo = {
  async getAll(): Promise<PurchaseItem[]> {
    const db = getDb();
    const rows = await db.getAllAsync<PurchaseItemRow>(
      'SELECT * FROM purchase_items ORDER BY name'
    );
    return rows.map(rowToEntity);
  },

  async getById(id: string): Promise<PurchaseItem | null> {
    const db = getDb();
    const row = await db.getFirstAsync<PurchaseItemRow>(
      'SELECT * FROM purchase_items WHERE id = ?',
      [id]
    );
    return row ? rowToEntity(row) : null;
  },

  async getByName(name: string): Promise<PurchaseItem | null> {
    const db = getDb();
    const row = await db.getFirstAsync<PurchaseItemRow>(
      'SELECT * FROM purchase_items WHERE name = ? COLLATE NOCASE',
      [name]
    );
    return row ? rowToEntity(row) : null;
  },

  async create(
    data: Omit<PurchaseItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PurchaseItem> {
    const db = getDb();
    const entity: PurchaseItem = {
      ...data,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    const row = entityToRow(entity);
    await db.runAsync(
      'INSERT INTO purchase_items (id, name, highlight_color, icon, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [row.id, row.name, row.highlight_color, row.icon, row.created_at, row.updated_at]
    );
    return entity;
  },

  async update(
    id: string,
    patch: Partial<Omit<PurchaseItem, 'id' | 'createdAt'>>
  ): Promise<PurchaseItem> {
    const db = getDb();
    const existing = await purchaseItemRepo.getById(id);
    if (!existing) throw new Error(`PurchaseItem ${id} not found`);
    const updated: PurchaseItem = { ...existing, ...patch, updatedAt: nowIso() };
    const row = entityToRow(updated);
    await db.runAsync(
      'UPDATE purchase_items SET name = ?, highlight_color = ?, icon = ?, updated_at = ? WHERE id = ?',
      [row.name, row.highlight_color, row.icon, row.updated_at, row.id]
    );
    return updated;
  },

  async remove(id: string): Promise<void> {
    const db = getDb();
    await db.runAsync('DELETE FROM purchase_items WHERE id = ?', [id]);
  },

  async countListReferences(id: string): Promise<number> {
    const db = getDb();
    const row = await db.getFirstAsync<{ cnt: number }>(
      'SELECT COUNT(*) as cnt FROM shopping_list_items WHERE purchase_item_id = ?',
      [id]
    );
    return row?.cnt ?? 0;
  },
};
