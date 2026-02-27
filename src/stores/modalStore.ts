import { create } from 'zustand';
import { ModalType, Post, Trail } from '../types';

interface ModalData {
  post?: Post;
  trail?: Trail;
}

interface ModalState {
  currentModal: ModalType;
  selectedPost: Post | null;
  selectedTrail: Trail | null;
  openModal: (modal: ModalType, data?: Post | ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  currentModal: null,
  selectedPost: null,
  selectedTrail: null,
  openModal: (modal, data) =>
    set((state) => {
      // 後方互換: Post直接渡し or { post, trail } オブジェクト渡し
      if (!data) {
        return { currentModal: modal, selectedPost: state.selectedPost, selectedTrail: state.selectedTrail };
      }
      if ('postId' in data) {
        // Post が直接渡された場合
        return { currentModal: modal, selectedPost: data as Post, selectedTrail: state.selectedTrail };
      }
      // ModalData オブジェクトの場合
      const modalData = data as ModalData;
      return {
        currentModal: modal,
        selectedPost: modalData.post !== undefined ? modalData.post : state.selectedPost,
        selectedTrail: modalData.trail !== undefined ? modalData.trail : state.selectedTrail,
      };
    }),
  closeModal: () => set({ currentModal: null, selectedPost: null, selectedTrail: null }),
}));
