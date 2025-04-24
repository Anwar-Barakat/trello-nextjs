import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Board } from "@/types/board.types";
import useBoardStore from "@/stores/board.store";
import { deleteBoard } from "@/actions/board/delete-board";
import { updateBoard } from "@/actions/board/update-board";

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
  const [isBoardEditing, setIsBoardEditing] = useState(false);

  // Sync store with initial boards
  useEffect(() => {
    if (initialBoards) {
      setBoards(initialBoards);
    }
  }, [initialBoards, setBoards]);

  // Filter boards based on search query
  const filteredBoards = isLoading
    ? []
    : boards.filter((board: Board) =>
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
        if ("error" in result && result.error) {
          setError(result.error);
          return;
        }

        setBoards(boards.filter((b: Board) => b.id !== boardId));
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

  /**
   * Handle board editing
   */
  const handleEditBoard = useCallback(
    async (boardId: string, newTitle: string) => {
      if (!boardId || !newTitle.trim()) return;

      try {
        setError(null);
        setIsBoardEditing(true);
        setIsLoading(true);

        const result = await updateBoard(boardId, { title: newTitle.trim() });
        if ("error" in result && result.error) {
          setError(result.error as string);
          return;
        }

        const updatedBoard = "data" in result && result.data
          ? result.data
          : ({ id: boardId, title: newTitle.trim() } as Board);

        setBoards(boards.map((b: Board) => (b.id === boardId ? updatedBoard : b)));
        router.refresh();
      } catch (err) {
        console.error("Error editing board:", err);
        setError(err instanceof Error ? err.message : "Failed to edit board");
      } finally {
        setIsBoardEditing(false);
        setIsLoading(false);
      }
    },
    [boards, router, setBoards, setIsLoading]
  );

  return {
    boards: filteredBoards,
    allBoards: boards,
    deletingId,
    error,
    searchQuery,
    setSearchQuery,
    handleDeleteBoard,
    handleEditBoard,
    isLoading,
    isBoardEditing,
  };
};
