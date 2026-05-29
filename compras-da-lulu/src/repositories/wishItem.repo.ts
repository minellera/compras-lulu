import { getDb } from './db';
import { newId } from '@/utils/uuid';
import { nowIso } from '@/utils/date';
import type { WishItem } from '@/types';

type WishItemRow = {
  id: string;
  name: string;
  description: string;
  price_brl: number;
  icon: string;
  purchase_link: string;
  photo_uri: string | null;
  background_color: string;
  acquired: number;
  acquired_at: string | null;
  created_at: string;
  updated_at: string;
};

export function rowToEntity(row: WishItemRow): WishItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceBRL: row.price_brl,
    icon: row.icon,
    purchaseLink: row.purchase_link,
    photoUri: row.photo_uri,
    backgroundColor: row.background_color,
    acquired: row.acquired === 1,
    acquiredAt: row.acquired_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const wishItemRepo = {
  async getAll(): Promise<WishItem[]> {
    const db = getDb();
    const rows = await db.getAllAsync<WishItemRow>(
      'SELECT * FROM wish_items ORDER BY created_at DESC'
    );
    return rows.map(rowToEntity);
  },

  async getById(id: string): Promise<WishItem | null> {
    const db = getDb();
    const row = await db.getFirstAsync<WishItemRow>(
      'SELECT * FROM wish_items WHERE id = ?',
      [id]
    );
    return row ? rowToEntity(row) : null;
  },

  async create(
    data: Omit<WishItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WishItem> {
    const db = getDb();
    const entity: WishItem = {
      ...data,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await db.runAsync(
      'INSERT INTO wish_items (id, name, description, price_brl, icon, purchase_link, photo_uri, background_color, acquired, acquired_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [entity.id, entity.name, entity.description, entity.priceBRL, entity.icon, entity.purchaseLink, entity.photoUri, entity.backgroundColor, entity.acquired ? 1 : 0, entity.acquiredAt, entity.createdAt, entity.updatedAt]
    );
    return entity;
  },

  async update(
    id: string,
    patch: Partial<Omit<WishItem, 'id' | 'createdAt'>>
  ): Promise<WishItem> {
    const db = getDb();
    const existing = await wishItemRepo.getById(id);
    if (!existing) throw new Error(`WishItem ${id} not found`);
    const updated: WishItem = { ...existing, ...patch, updatedAt: nowIso() };
    await db.runAsync(
      'UPDATE wish_items SET name = ?, description = ?, price_brl = ?, icon = ?, purchase_link = ?, photo_uri = ?, background_color = ?, acquired = ?, acquired_at = ?, updated_at = ? WHERE id = ?',
      [updated.name, updated.description, updated.priceBRL, updated.icon, updated.purchaseLink, updated.photoUri, updated.backgroundColor, updated.acquired ? 1 : 0, updated.acquiredAt, updated.updatedAt, updated.id]
    );
    return updated;
  },

  async remove(id: string): Promise<void> {
    const db = getDb();
    await db.runAsync('DELETE FROM wish_items WHERE id = ?', [id]);
  },
};
