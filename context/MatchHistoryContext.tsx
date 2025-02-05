import { createContext, ReactNode, useContext, useRef, useState } from "react";

interface MatchHistoryState {
  match?: MatchDetails;
  setMatch: (matchHistory: MatchDetails) => void;
}

export const MatchHistoryContext = createContext<MatchHistoryState | null>(
  null
);

export const MatchHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [match, setMatch] = useState<MatchDetails>();
  return (
    <MatchHistoryContext.Provider value={{ match, setMatch }}>
      {children}
    </MatchHistoryContext.Provider>
  );
};

export const useMatchHistory = () => {
  const context = useContext(MatchHistoryContext);
  if (!context) {
    throw new Error(
      "useMatchHistory must be used within a MatchHistoryProvider"
    );
  }
  return context;
};
