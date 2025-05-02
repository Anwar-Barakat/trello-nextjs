import { create } from "zustand";
import {
  type BoardActions,
  boardSlice,
  type BoardState,
} from "./slices/board-slice";
import { createJSONStorage, persist } from "zustand/middleware";

const useBoardStore = create<BoardState & BoardActions>()(
  persist(
    (...args) => ({
      ...boardSlice(...args),
    }),
    {
      name: "board",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useBoards = () => useBoardStore((state) => state.boards);
export const useIsLoading = () => useBoardStore((state) => state.isLoading);
export const useIsBoardDeleting = () =>
  useBoardStore((state) => state.isBoardDeleting);
export const useErrors = () => useBoardStore((state) => state.errors);
export const useSetErrors = () => useBoardStore((state) => state.setErrors);

export default useBoardStore;
