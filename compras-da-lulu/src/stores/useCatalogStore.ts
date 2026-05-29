import { create } from 'zustand';
import { purchaseItemRepo } from '@/repositories/purchaseItem.repo';
import type { PurchaseItem } from '@/types';

interface CatalogState {
  items: PurchaseItem[];
  load: () => Promise<void>;
  add: (data: Omit<PurchaseItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PurchaseItem>;
  edit: (id: string, patch: Partial<Omit<PurchaseItem, 'id' | 'createdAt'>>) => Promise<PurchaseItem>;
  remove: (id: string) => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  items: [],

  load: async () => {
    const items = await purchaseItemRepo.getAll();
    set({ items });
  },

  add: async (data) => {
    const item = await purchaseItemRepo.create(data);
    set({ items: [...get().items, item] });
    return item;
  },

  edit: async (id, patch) => {
    const updated = await purchaseItemRepo.update(id, patch);
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
    return updated;
  },

  remove: async (id) => {
    await purchaseItemRepo.remove(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));
