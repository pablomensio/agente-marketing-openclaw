import { create } from 'zustand';

interface GlobalState {
  missingKeys: string[];
  setMissingKeys: (keys: string[]) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

export const useStore = create<GlobalState>((set) => ({
  missingKeys: [],
  setMissingKeys: (keys) => set({ missingKeys: keys }),
  refreshKey: 0,
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
