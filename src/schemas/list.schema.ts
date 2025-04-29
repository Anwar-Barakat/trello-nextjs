import { z } from "zod";

// Schema for list creation
export const listFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  boardId: z.string().min(1, "Board ID is required"),
});

// Schema for list update
export const listUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),
});

// Schema for list reordering
export const listReorderSchema = z.object({
  boardId: z.string().min(1, "Board ID is required"),
  listId: z.string().min(1, "List ID is required"),
  newOrder: z.number().int().positive(),
});

// Export types for usage in components and services
export type ListFormSchema = z.infer<typeof listFormSchema>;
export type ListUpdateSchema = z.infer<typeof listUpdateSchema>;
export type ListReorderSchema = z.infer<typeof listReorderSchema>;
