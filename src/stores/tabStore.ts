import { create } from 'zustand';
import { TabType } from '../types';

interface TabState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: 'map',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
