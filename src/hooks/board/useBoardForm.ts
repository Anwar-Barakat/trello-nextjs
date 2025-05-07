import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useBoardStore from "@/stores/board.store";
import useUnsplashStore from "@/stores/unsplash.store";
import {
  boardDefaultValues,
  boardFormSchema,
  type BoardFormSchema,
} from "@/schemas/board.schema";
import { createBoard } from "@/actions/board/create-board";
import { toast } from "sonner";
import type { Board } from "@/types/board.types";

export const useBoardForm = () => {
  const router = useRouter();
  const {
    setIsLoading,
    addBoard,
    setErrors: setStoreErrors,
    setIsOpenModal,
  } = useBoardStore();
  const { selectedImageId } = useUnsplashStore();
  const [errors, setErrors] = useState<string[]>([]);

  const form = useForm<BoardFormSchema>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      ...boardDefaultValues,
      image: selectedImageId || undefined,
    },
    mode: "onChange",
  });

  // Update form value when selectedImageId changes
  useEffect(() => {
    if (selectedImageId !== form.getValues().image) {
      form.setValue("image", selectedImageId || "");
    }
  }, [selectedImageId, form]);

  const onSubmit = async (data: BoardFormSchema) => {
    try {
      setIsLoading(true);
      setErrors([]);
      setStoreErrors([]);

      // Make sure image is included
      const formData = {
        ...data,
        image: data.image || selectedImageId || "",
      };

      const result = await createBoard(formData);

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
        addBoard(result.data);
        form.reset();
        setIsOpenModal(false);
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
  };
};
