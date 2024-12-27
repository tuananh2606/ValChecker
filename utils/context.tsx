import { createContext, ReactElement, useContext, useState } from "react";

import { createStore, useStore, StoreApi } from "zustand";

type WebviewStore = {
  ref: any;
  setRef: (ref: any) => void;
};

const WebviewContext = createContext<StoreApi<WebviewStore> | undefined>(
  undefined
);

export const WebviewProvider = ({ children }: { children: ReactElement }) => {
  const [store] = useState(() =>
    createStore<WebviewStore>((set) => ({
      ref: null,
      setRef: (state) => set({ ref: state }),
    }))
  );

  return (
    <WebviewContext.Provider value={store}>{children}</WebviewContext.Provider>
  );
};

export const useWebviewContext = () => {
  const context = useContext(WebviewContext);
  if (!context) {
    throw new Error("Missing StoreProvider");
  }
  return useStore(context);
};
