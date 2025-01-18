import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DarkModeState {
  darkModeEnabled: boolean;
  setDarkMode: (value: boolean) => void;
}
export const useDarkMode = create<DarkModeState>()(
  persist(
    (set, get) => ({
      darkModeEnabled: true,
      setDarkMode: (value) => {
        set({ darkModeEnabled: value });
      },
    }),
    {
      name: "darkmode",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
