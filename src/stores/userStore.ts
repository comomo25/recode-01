import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateNickname: (nickname: string) => void;
  clearUser: () => void;
}

// ユーザー情報をlocalStorageに永続化
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateNickname: (nickname) =>
        set((state) => ({
          user: state.user ? { ...state.user, nickname } : null,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // localStorageのキー名
    }
  )
);
