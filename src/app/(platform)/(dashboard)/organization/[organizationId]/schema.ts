import { z } from "zod";

export const boardFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be less than 50 characters")
    .trim(),
});

export const boardDefaultValues: BoardFormSchema = {
  title: "",
};

export type BoardFormSchema = z.infer<typeof boardFormSchema>;
