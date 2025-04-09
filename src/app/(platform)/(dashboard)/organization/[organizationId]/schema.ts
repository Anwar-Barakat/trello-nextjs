import { z } from "zod";

export const boardFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be less than 50 characters")
    .trim()
    .refine((val) => val.length > 0, {
      message: "Title cannot be empty",
    }),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  isPublic: z.boolean().default(false),
});

export const boardDefaultValues: BoardFormSchema = {
  title: "",
  description: "",
  isPublic: false,
};

export type BoardFormSchema = z.infer<typeof boardFormSchema>;
