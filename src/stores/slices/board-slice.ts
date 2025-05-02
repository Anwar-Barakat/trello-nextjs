import type { Board } from "@/types/board.types";
import type { StateCreator } from "zustand";

export interface BoardState {
  boards: Board[];
  availableCount: number;
  hasAvailableCount: boolean;
  isLoading: boolean;
  isBoardDeleting: boolean;
  isBoardEditing: boolean;
  errors: string[];
  isOpenModal: boolean;
}

export interface BoardActions {
  setAvailableCount: (availableCount: number) => void;
  setHasAvailableCount: (hasAvailableCount: boolean) => void;
  setBoards: (boards: Board[]) => void;
  addBoard: (board: Board) => void;
  updateBoard: (updatedBoard: Board) => void;
  removeBoard: (boardId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsBoardDeleting: (isBoardDeleting: boolean) => void;
  setIsBoardEditing: (isBoardEditing: boolean) => void;
  setErrors: (errors: string[]) => void;
  setIsOpenModal: (isOpen: boolean) => void;
}

export const boardSlice: StateCreator<BoardState & BoardActions> = (set) => ({
  // Initial State
  boards: [],
  availableCount: 0,
  hasAvailableCount: false,
  isLoading: false,
  isBoardDeleting: false,
  isBoardEditing: false,
  errors: [],
  isOpenModal: false,
  // Actions
  setBoards: (boards) => set({ boards }),
  setAvailableCount: (availableCount) => set({ availableCount }),
  setHasAvailableCount: (hasAvailableCount) => set({ hasAvailableCount }),
  addBoard: (board) =>
    set((state) => ({
      boards: [board, ...state.boards],
    })),

  updateBoard: (updatedBoard) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === updatedBoard.id ? updatedBoard : board
      ),
    })),

  removeBoard: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== boardId),
    })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsBoardDeleting: (isBoardDeleting) => set({ isBoardDeleting }),

  setIsBoardEditing: (isBoardEditing) => set({ isBoardEditing }),

  setErrors: (errors) => set({ errors }),

  setIsOpenModal: (isOpenModal) => set({ isOpenModal }),
});
