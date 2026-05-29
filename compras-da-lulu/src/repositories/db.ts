import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let _db: SQLiteDatabase | null = null;

export async function initDb(): Promise<SQLiteDatabase> {
  if (_db) return _db;

  _db = await openDatabaseAsync('compras-da-lulu.db');

  await _db.execAsync('PRAGMA journal_mode = WAL;');
  await _db.execAsync('PRAGMA foreign_keys = ON;');

  await _db.execAsync(`
    CREATE TABLE IF NOT EXISTS purchase_items (
      id              TEXT PRIMARY KEY,
      name            TEXT NOT NULL COLLATE NOCASE,
      highlight_color TEXT NOT NULL,
      icon            TEXT NOT NULL,
      created_at      TEXT NOT NULL,
      updated_at      TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_purchase_items_name
      ON purchase_items (name);

    CREATE TABLE IF NOT EXISTS shopping_lists (
      id           TEXT PRIMARY KEY,
      title        TEXT NOT NULL,
      description  TEXT NOT NULL DEFAULT '',
      status       TEXT NOT NULL DEFAULT 'open',
      total_value  REAL,
      completed_at TEXT,
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shopping_list_items (
      id               TEXT PRIMARY KEY,
      list_id          TEXT NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
      purchase_item_id TEXT NOT NULL,
      quantity         REAL NOT NULL,
      quantity_type    TEXT NOT NULL,
      in_cart          INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS wish_items (
      id               TEXT PRIMARY KEY,
      name             TEXT NOT NULL,
      description      TEXT NOT NULL DEFAULT '',
      price_brl        REAL NOT NULL,
      icon             TEXT NOT NULL,
      purchase_link    TEXT NOT NULL DEFAULT '',
      photo_uri        TEXT,
      background_color TEXT NOT NULL,
      acquired         INTEGER NOT NULL DEFAULT 0,
      acquired_at      TEXT,
      created_at       TEXT NOT NULL,
      updated_at       TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      id          TEXT PRIMARY KEY,
      theme       TEXT NOT NULL DEFAULT 'white',
      font_family TEXT NOT NULL DEFAULT 'Inter'
    );
  `);

  return _db;
}

export function getDb(): SQLiteDatabase {
  if (!_db) throw new Error('Database not initialized — call initDb() first.');
  return _db;
}
