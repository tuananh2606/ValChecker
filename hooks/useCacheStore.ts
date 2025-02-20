// store.ts
import { zustandStorage } from "@/utils/helper";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CacheState {
  data: Record<string, any>;
  setData: (key: string, value: any) => void;
  getData: (key: string) => any;
  clearData: (key: string) => void;
  clearAll: () => void;
}

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      data: {},

      setData: (key, value) => {
        set((state) => ({ data: { ...state.data, [key]: value } }));
      },

      getData: (key) => get().data[key],

      clearData: (key) => {
        const newItems = { ...get().data };
        delete newItems[key];
        set(() => ({ data: { ...newItems } }));
      },

      clearAll: () => {
        set({ data: {} });
      },
    }),
    {
      name: "cache-store",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
