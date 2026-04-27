import { create } from 'zustand';
import { AppState, TopAttributes, BottomAttributes, AnchorConfig } from './types';
import { DEFAULT_STATE } from './constants';

interface StoreActions {
  setCategory: (category: AppState['category']) => void;
  updateTop: (updates: Partial<TopAttributes>) => void;
  updateBottom: (updates: Partial<BottomAttributes>) => void;
  updateTopAnchor: (updates: Partial<AnchorConfig>) => void;
  updateBottomAnchor: (updates: Partial<AnchorConfig>) => void;
  updatePantsLengthAnchor: (updates: Partial<AnchorConfig>) => void;
}

export const useStore = create<AppState & StoreActions>((set) => ({
  ...DEFAULT_STATE,
  setCategory: (category) => set({ category }),
  updateTop: (updates) => set((state) => ({ topAttributes: { ...state.topAttributes, ...updates } })),
  updateBottom: (updates) => set((state) => ({ bottomAttributes: { ...state.bottomAttributes, ...updates } })),
  updateTopAnchor: (updates) => set((state) => ({ topAnchor: { ...state.topAnchor, ...updates } })),
  updateBottomAnchor: (updates) => set((state) => ({ bottomAnchor: { ...state.bottomAnchor, ...updates } })),
  updatePantsLengthAnchor: (updates) => set((state) => ({ pantsLengthAnchor: { ...state.pantsLengthAnchor, ...updates } })),
}));
