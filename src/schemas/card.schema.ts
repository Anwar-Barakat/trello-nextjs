import { z } from "zod";

// Schema for card creation
export const cardFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  listId: z.string().min(1, "List ID is required"),
  description: z.string().optional(),
});

// Schema for card update
export const cardUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),
  description: z.string().optional(),
});

// Schema for card reordering within the same list
export const cardReorderSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
  listId: z.string().min(1, "List ID is required"),
  newOrder: z.number().int().positive(),
});

// Schema for card moving between lists
export const cardMoveSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
  sourceListId: z.string().min(1, "Source list ID is required"),
  targetListId: z.string().min(1, "Target list ID is required"),
  newOrder: z.number().int().positive(),
});

// Export types for usage in components and services
export type CardFormSchema = z.infer<typeof cardFormSchema>;
export type CardUpdateSchema = z.infer<typeof cardUpdateSchema>;
export type CardReorderSchema = z.infer<typeof cardReorderSchema>;
export type CardMoveSchema = z.infer<typeof cardMoveSchema>;
