import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Board } from "@/types/board.types";
import useBoardStore from "@/stores/board.store";
import { deleteBoard } from "@/actions/board/delete-board";

interface UseBoardOptions {
  initialBoards: Board[];
}

/**
 * Custom hook for board management
 */
export const useBoard = ({ initialBoards }: UseBoardOptions) => {
  const router = useRouter();
  const { boards, setBoards, setIsBoardDeleting, isLoading, setIsLoading } = useBoardStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync store with initialBoards from server
  useEffect(() => {
    if (initialBoards) {
      setBoards(initialBoards);
    }
  }, [initialBoards, setBoards]);

  // Filter boards based on search query
  const filteredBoards = isLoading ? [] : boards.filter((board) =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Handle board deletion
   */
  const handleDeleteBoard = useCallback(
    async (boardId: string) => {
      if (!boardId) return;

      try {
        setError(null);
        setDeletingId(boardId);
        setIsBoardDeleting(true);
        setIsLoading(true);

        const result = await deleteBoard(boardId);

        if (result.error) {
          setError(result.error);
          return;
        }

        // Update local state
        setBoards(boards.filter((board) => board.id !== boardId));

        // Refresh the page
        router.refresh();
      } catch (err) {
        console.error("Error deleting board:", err);
        setError(err instanceof Error ? err.message : "Failed to delete board");
      } finally {
        setDeletingId(null);
        setIsBoardDeleting(false);
        setIsLoading(false);
      }
    },
    [boards, router, setBoards, setIsBoardDeleting, setIsLoading]
  );

  return {
    boards: filteredBoards,
    allBoards: boards,
    deletingId,
    error,
    searchQuery,
    setSearchQuery,
    handleDeleteBoard,
    isLoading,
  };
};
