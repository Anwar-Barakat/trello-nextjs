import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useBoardStore from "@/stores/board.store";
import {
  boardDefaultValues,
  boardFormSchema,
  type BoardFormSchema,
} from "@/schemas/board.schema";
import { createBoard } from "@/actions/board/create-board";

/**
 * Custom hook for board form management
 */
export const useBoardForm = () => {
  const router = useRouter();
  const { setIsLoading, addBoard } = useBoardStore();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BoardFormSchema>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: boardDefaultValues,
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: BoardFormSchema) => {
    try {
      setError(null);
      setIsLoading(true);

      const result = await createBoard(data);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.data) {
        // Update local state
        addBoard(result.data);

        // Reset the form
        form.reset();

        // Refresh the page
        router.refresh();
      }
    } catch (err) {
      console.error("Error creating board:", err);
      setError(err instanceof Error ? err.message : "Failed to create board");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    error,
    isSubmitting: form.formState.isSubmitting,
  };
};
