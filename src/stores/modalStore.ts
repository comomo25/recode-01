import { create } from 'zustand';
import { ModalType, Post } from '../types';

interface ModalState {
  currentModal: ModalType;
  selectedPost: Post | null;
  openModal: (modal: ModalType, post?: Post) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  currentModal: null,
  selectedPost: null,
  openModal: (modal, post) =>
    set((state) => ({
      currentModal: modal,
      selectedPost: post !== undefined ? post : state.selectedPost,
    })),
  closeModal: () => set({ currentModal: null, selectedPost: null }),
}));
