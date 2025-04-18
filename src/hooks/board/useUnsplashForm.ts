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
import { toast } from "sonner";

export const useBoardForm = () => {
  const router = useRouter();
  const { setIsLoading, addBoard, setErrors: setStoreErrors } = useBoardStore();
  const [errors, setErrors] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<BoardFormSchema>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: boardDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: BoardFormSchema) => {
    try {
      setIsLoading(true);
      setErrors([]);
      setStoreErrors([]);

      const result = await createBoard(data);

      if (result.error) {
        const errorMessage = result.error;
        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
        setStoreErrors([errorMessage]);
        return;
      }

      if (result.data) {
        addBoard(result.data);
        form.reset();
        setIsOpen(false);
        toast.success("Board created successfully", {
          duration: 4000,
          position: "top-center",
        });
        router.refresh();
      }
    } catch (err) {
      console.error("Error creating board:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create board";
      setErrors([errorMessage]);
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
      setStoreErrors([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    errors,
    isSubmitting: form.formState.isSubmitting,
    isOpen,
    setIsOpen,
  };
};
