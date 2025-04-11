import { z } from "zod";

export const errorMessages = {
  title: {
    required: "Title is required",
    tooLong: "Title must be less than 50 characters",
    empty: "Title cannot be empty",
  },
};

export const boardFormSchema = z.object({
  title: z
    .string()
    .min(1, errorMessages.title.required)
    .max(50, errorMessages.title.tooLong)
    .trim(),
});

export const boardDefaultValues = {
  title: "",
};

export type BoardFormSchema = z.infer<typeof boardFormSchema>;
