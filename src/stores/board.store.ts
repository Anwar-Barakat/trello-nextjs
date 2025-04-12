import { create } from "zustand";
import { createBoardSlice, type BoardSlice } from "./slices/board-slice";
import { createJSONStorage, persist } from "zustand/middleware";

const useBoardStore = create<BoardSlice>()(
  persist(
    (...args) => ({
      ...createBoardSlice(...args),
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

export default useBoardStore;
