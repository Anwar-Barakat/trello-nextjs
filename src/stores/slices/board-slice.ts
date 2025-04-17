import type { Board } from "@/types/board.types";
import type { StateCreator } from "zustand";

export interface BoardState {
  boards: Board[];
  isLoading: boolean;
  isBoardDeleting: boolean;
  errors: string[];
  isOpenModal: boolean;
}

export interface BoardActions {
  setBoards: (boards: Board[]) => void;
  addBoard: (board: Board) => void;
  removeBoard: (boardId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsBoardDeleting: (isBoardDeleting: boolean) => void;
  setErrors: (errors: string[]) => void;
  setIsOpenModal: (isOpen: boolean) => void;
}

export const createBoardSlice: StateCreator<BoardState & BoardActions> = (
  set
) => ({
  // Initial State
  boards: [],
  isLoading: false,
  isBoardDeleting: false,
  errors: [],
  isOpenModal: false,
  // Actions
  setBoards: (boards) => set({ boards }),

  addBoard: (board) =>
    set((state) => ({
      boards: [board, ...state.boards],
    })),

  removeBoard: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== boardId),
    })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsBoardDeleting: (isBoardDeleting) => set({ isBoardDeleting }),

  setErrors: (errors) => set({ errors }),

  setIsOpenModal: (isOpenModal) => set({ isOpenModal }),
});
