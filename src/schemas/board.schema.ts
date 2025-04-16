import { z } from "zod";

export const errorMessages = {
  title: {
    required: "Title is required",
    tooLong: "Title must be less than 50 characters",
    empty: "Title cannot be empty",
  },
  image: {
    required: "Please select an image",
  },
};

export const boardFormSchema = z.object({
  title: z
    .string()
    .min(1, errorMessages.title.required)
    .max(50, errorMessages.title.tooLong)
    .trim(),
  image: z.string().min(1, errorMessages.image.required).optional(),
  imageId: z.string().optional(),
  imageThumbUrl: z.string().optional(),
  imageFullUrl: z.string().optional(),
  imageUserName: z.string().optional(),
});

export const boardDefaultValues = {
  title: "",
  image: undefined,
  imageId: undefined,
  imageThumbUrl: undefined,
  imageFullUrl: undefined,
  imageUserName: undefined,
};

export type BoardFormSchema = z.infer<typeof boardFormSchema>;
