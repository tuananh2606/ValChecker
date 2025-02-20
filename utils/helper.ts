import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

export const storage = new MMKV({
  id: "cache-storage",
});

export const zustandStorage: StateStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: any) => storage.set(name, value),
  removeItem: (name) => storage.delete(name),
};
