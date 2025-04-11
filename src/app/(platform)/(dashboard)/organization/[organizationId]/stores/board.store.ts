import type { Board } from "@/types/board.types";
import { create } from "zustand";

// Removing persist middleware for now to simplify troubleshooting
interface BoardStoreState {
  isLoading: boolean;
  boards: Board[];
  isBoardDeleting: boolean;
}

interface BoardStoreActions {
  setBoards: (boards: Board[]) => void;
  setIsBoardDeleting: (isBoardDeleting: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const useBoardStore = create<BoardStoreState & BoardStoreActions>((set) => ({
  // State
  boards: [],
  isBoardDeleting: false,
  isLoading: false,
  // Actions
  setBoards: (boards) => set({ boards }),
  setIsBoardDeleting: (isBoardDeleting) => set({ isBoardDeleting }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useBoardStore;
