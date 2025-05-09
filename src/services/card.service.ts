import { AppError } from "@/types/error.types";
import { prisma } from "@/lib/prisma";
import type { CardFormSchema, CardUpdateSchema } from "@/schemas/card.schema";
import type { Card } from "@prisma/client";
import { Prisma } from "@prisma/client";

export const CardService = {
  /**
   * Create a new card
   */
  async create(data: CardFormSchema) {
    try {
      // Find the last card to determine order
      const lastCard = await prisma.card.findFirst({
        where: {
          listId: data.listId,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });

      const newOrder = lastCard ? lastCard.order + 1 : 1;

      const card = await prisma.card.create({
        data: {
          title: data.title,
          description: data.description || "",
          listId: data.listId,
          order: newOrder,
        },
      });

      return card;
    } catch (error) {
      console.error("CardService.create error:", error);
      throw new AppError("Failed to create card", "CARD_CREATE_ERROR");
    }
  },

  /**
   * Update a card by ID
   */
  async update(cardId: string, data: CardUpdateSchema) {
    try {
      const updatedCard = await prisma.card.update({
        where: {
          id: cardId,
        },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
        },
      });

      return updatedCard;
    } catch (error) {
      console.error("CardService.update error:", error);
      throw new AppError("Failed to update card", "CARD_UPDATE_ERROR");
    }
  },

  /**
   * Delete a card by ID
   */
  async delete(cardId: string) {
    try {
      // First check if the card exists
      const cardExists = await prisma.card.findUnique({
        where: {
          id: cardId,
        },
      });

      if (!cardExists) {
        throw new AppError("Card not found", "CARD_NOT_FOUND");
      }

      // Delete the card
      const deletedCard = await prisma.card.delete({
        where: {
          id: cardId,
        },
      });

      return deletedCard;
    } catch (error) {
      console.error("CardService.delete error:", error);

      // Handle specific Prisma errors
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Card not found", "CARD_NOT_FOUND");
      }

      // For any other error, throw a general card delete error
      throw new AppError("Failed to delete card", "CARD_DELETE_ERROR");
    }
  },

  /**
   * Get a single card by ID
   */
  async getById(cardId: string) {
    try {
      const card = await prisma.card.findUnique({
        where: {
          id: cardId,
        },
        include: {
          list: {
            include: {
              board: true,
            },
          },
        },
      });

      if (!card) {
        throw new AppError("Card not found", "CARD_NOT_FOUND");
      }

      return card;
    } catch (error) {
      console.error("CardService.getById error:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to get card", "CARD_GET_ERROR");
    }
  },

  /**
   * Reorder cards within the same list
   */
  async reorder(cardId: string, listId: string, newOrder: number) {
    try {
      // Get the current card
      const card = await prisma.card.findUnique({
        where: {
          id: cardId,
        },
        select: {
          order: true,
          listId: true,
        },
      });

      if (!card) {
        throw new AppError("Card not found", "CARD_NOT_FOUND");
      }

      if (card.listId !== listId) {
        throw new AppError(
          "Card belongs to a different list",
          "CARD_LIST_MISMATCH"
        );
      }

      // Update cards order based on the new position
      if (card.order > newOrder) {
        // Moving card up: increment order of cards between new position and current position
        await prisma.card.updateMany({
          where: {
            listId,
            order: {
              gte: newOrder,
              lt: card.order,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      } else if (card.order < newOrder) {
        // Moving card down: decrement order of cards between current position and new position
        await prisma.card.updateMany({
          where: {
            listId,
            order: {
              gt: card.order,
              lte: newOrder,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });
      }

      // Update the target card's order
      const updatedCard = await prisma.card.update({
        where: {
          id: cardId,
        },
        data: {
          order: newOrder,
        },
      });

      return updatedCard;
    } catch (error) {
      console.error("CardService.reorder error:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to reorder card", "CARD_REORDER_ERROR");
    }
  },

  /**
   * Move a card to a different list
   */
  async move(
    cardId: string,
    sourceListId: string,
    targetListId: string,
    newOrder: number
  ) {
    try {
      // Get the current card
      const card = await prisma.card.findUnique({
        where: {
          id: cardId,
        },
        select: {
          order: true,
          listId: true,
        },
      });

      if (!card) {
        throw new AppError("Card not found", "CARD_NOT_FOUND");
      }

      if (card.listId !== sourceListId) {
        throw new AppError(
          "Card belongs to a different list",
          "CARD_LIST_MISMATCH"
        );
      }

      // Update order of cards in the source list
      await prisma.card.updateMany({
        where: {
          listId: sourceListId,
          order: {
            gt: card.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });

      // Update order of cards in the target list
      await prisma.card.updateMany({
        where: {
          listId: targetListId,
          order: {
            gte: newOrder,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });

      // Move the card to the target list with the new order
      const updatedCard = await prisma.card.update({
        where: {
          id: cardId,
        },
        data: {
          listId: targetListId,
          order: newOrder,
        },
      });

      return updatedCard;
    } catch (error) {
      console.error("CardService.move error:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to move card", "CARD_MOVE_ERROR");
    }
  },

  /**
   * Copy a card
   */
  async copy(cardId: string, listId?: string) {
    try {
      // Get the original card
      const originalCard = await prisma.card.findUnique({
        where: {
          id: cardId,
        },
      });

      if (!originalCard) {
        throw new AppError("Card not found", "CARD_NOT_FOUND");
      }

      // Determine the target list
      const targetListId = listId || originalCard.listId;

      // Find the last card to determine new order
      const lastCard = await prisma.card.findFirst({
        where: {
          listId: targetListId,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });

      const newOrder = lastCard ? lastCard.order + 1 : 1;

      // Create the new card
      const newCard = await prisma.card.create({
        data: {
          title: `${originalCard.title} (Copy)`,
          description: originalCard.description,
          listId: targetListId,
          order: newOrder,
        },
      });

      return newCard;
    } catch (error) {
      console.error("CardService.copy error:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to copy card", "CARD_COPY_ERROR");
    }
  },
};
