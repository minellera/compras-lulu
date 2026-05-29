import { create } from 'zustand';
import { wishItemRepo } from '@/repositories/wishItem.repo';
import { nowIso } from '@/utils/date';
import type { WishItem } from '@/types';

interface WishState {
  items: WishItem[];
  load: () => Promise<void>;
  add: (data: Omit<WishItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<WishItem>;
  edit: (id: string, patch: Partial<Omit<WishItem, 'id' | 'createdAt'>>) => Promise<WishItem>;
  remove: (id: string) => Promise<void>;
  markAcquired: (id: string) => Promise<WishItem>;
}

export const useWishStore = create<WishState>((set, get) => ({
  items: [],

  load: async () => {
    const items = await wishItemRepo.getAll();
    set({ items });
  },

  add: async (data) => {
    const item = await wishItemRepo.create(data);
    set({ items: [item, ...get().items] });
    return item;
  },

  edit: async (id, patch) => {
    const updated = await wishItemRepo.update(id, patch);
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
    return updated;
  },

  remove: async (id) => {
    await wishItemRepo.remove(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },

  markAcquired: async (id) => {
    return get().edit(id, { acquired: true, acquiredAt: nowIso() });
  },
}));
