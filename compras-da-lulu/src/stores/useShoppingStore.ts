import { create } from 'zustand';
import { shoppingListRepo } from '@/repositories/shoppingList.repo';
import { nowIso } from '@/utils/date';
import type { ShoppingList } from '@/types';

interface ShoppingState {
  lists: ShoppingList[];
  load: () => Promise<void>;
  create: (data: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ShoppingList>;
  update: (id: string, patch: Partial<Omit<ShoppingList, 'id' | 'createdAt'>>) => Promise<ShoppingList>;
  remove: (id: string) => Promise<void>;
  complete: (id: string, totalValue: number | null) => Promise<ShoppingList>;
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  lists: [],

  load: async () => {
    const lists = await shoppingListRepo.getAll();
    set({ lists });
  },

  create: async (data) => {
    const list = await shoppingListRepo.create(data);
    set({ lists: [list, ...get().lists] });
    return list;
  },

  update: async (id, patch) => {
    const updated = await shoppingListRepo.update(id, patch);
    set({ lists: get().lists.map((l) => (l.id === id ? updated : l)) });
    return updated;
  },

  remove: async (id) => {
    await shoppingListRepo.remove(id);
    set({ lists: get().lists.filter((l) => l.id !== id) });
  },

  complete: async (id, totalValue) => {
    return get().update(id, {
      status: 'completed',
      totalValue,
      completedAt: nowIso(),
    });
  },
}));
