import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useBoardStore from "@/stores/board.store";
import useUnsplashStore from "@/stores/unsplash.store";
import {
  boardFormSchema,
  type BoardFormSchema,
} from "@/schemas/board.schema";
import { updateBoard } from "@/actions/board/update-board";
import { toast } from "sonner";
import type { Board } from "@/types/board.types";

export const useEditBoardForm = ({ board }: { board: Board }) => {
  const router = useRouter();
  const {
    setIsLoading,
    updateBoard: updateStoreBoard,
    setErrors: setStoreErrors,
    setIsOpenModal,
  } = useBoardStore();
  const { selectedImageId } = useUnsplashStore();
  const [errors, setErrors] = useState<string[]>([]);

  const form = useForm<BoardFormSchema>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      ...board,
      image: selectedImageId || board.image || undefined,
    },
    mode: "onChange",
  });

  // Update form value when selectedImageId changes
  if (selectedImageId !== form.getValues().image) {
    form.setValue("image", selectedImageId || board.image || "");
  }

  const onSubmit = async (data: BoardFormSchema) => {
    try {
      setIsLoading(true);
      setErrors([]);
      setStoreErrors([]);

      const formData = {
        ...data,
        id: board.id,
        image: data.image || selectedImageId || board.image || "",
      };

      const result = await updateBoard(formData);

      if ("error" in result) {
        const errorMessage = result.error || "An unknown error occurred";
        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
        setErrors([errorMessage]);
        setStoreErrors([errorMessage]);
        return;
      }

      if ("data" in result) {
        updateStoreBoard(result.data);
        setIsOpenModal(false);
        toast.success("Board updated successfully", {
          duration: 4000,
          position: "top-center",
        });
        router.refresh();
      }
    } catch (err) {
      console.error("Error updating board:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update board";
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
  };
};
