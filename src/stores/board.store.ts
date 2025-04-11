import { create } from "zustand";
import { createBoardSlice, type BoardSlice } from "./slices/board-slice";

const useBoardStore = create<BoardSlice>((...args) => ({
  ...createBoardSlice(...args),
}));

export const useBoards = () => useBoardStore((state) => state.boards);
export const useIsLoading = () => useBoardStore((state) => state.isLoading);
export const useIsBoardDeleting = () =>
  useBoardStore((state) => state.isBoardDeleting);

export default useBoardStore;
