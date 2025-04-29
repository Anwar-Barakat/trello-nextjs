import { AppError } from "@/types/error.types";
import { prisma } from "@/lib/prisma";
import type { ListFormSchema } from "@/schemas/list.schema";
import type { Card, List } from "@prisma/client";

export const ListService = {
  /**
   * Create a new list
   */
  async create(data: ListFormSchema) {
    try {
      // Find the last list to determine order
      const lastList = await prisma.list.findFirst({
        where: {
          boardId: data.boardId,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });

      const newOrder = lastList ? lastList.order + 1 : 1;

      const list = await prisma.list.create({
        data: {
          title: data.title,
          boardId: data.boardId,
          order: newOrder,
        },
      });

      return list;
    } catch (error) {
      console.error("ListService.create error:", error);
      throw new AppError("Failed to create list", "LIST_CREATE_ERROR");
    }
  },

  /**
   * Update a list by ID
   */
  async update(listId: string, data: Partial<ListFormSchema>) {
    try {
      const updatedList = await prisma.list.update({
        where: {
          id: listId,
        },
        data: {
          ...(data.title && { title: data.title }),
        },
      });

      return updatedList;
    } catch (error) {
      console.error("ListService.update error:", error);
      throw new AppError("Failed to update list", "LIST_UPDATE_ERROR");
    }
  },

  /**
   * Delete a list by ID
   */
  async delete(listId: string) {
    try {
      const deletedList = await prisma.list.delete({
        where: {
          id: listId,
        },
      });

      return deletedList;
    } catch (error) {
      console.error("ListService.delete error:", error);
      throw new AppError("Failed to delete list", "LIST_DELETE_ERROR");
    }
  },

  /**
   * Get all lists for a board with their cards
   */
  async getByBoardId(boardId: string) {
    try {
      const lists = await prisma.list.findMany({
        where: {
          boardId,
        },
        include: {
          cards: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });

      return lists;
    } catch (error) {
      console.error("ListService.getByBoardId error:", error);
      throw new AppError("Failed to get lists", "LIST_GET_ERROR");
    }
  },

  /**
   * Get a single list by ID with its cards
   */
  async getById(listId: string) {
    try {
      const list = await prisma.list.findUnique({
        where: {
          id: listId,
        },
        include: {
          cards: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      if (!list) {
        throw new AppError("List not found", "LIST_NOT_FOUND");
      }

      return list;
    } catch (error) {
      console.error("ListService.getById error:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to get list", "LIST_GET_ERROR");
    }
  },

  /**
   * Reorder lists within a board
   */
  async reorder(listId: string, newOrder: number, boardId: string) {
    try {
      // Get the current list
      const list = await prisma.list.findUnique({
        where: {
          id: listId,
        },
        select: {
          order: true,
        },
      });

      if (!list) {
        throw new AppError("List not found", "LIST_NOT_FOUND");
      }

      // Update lists order based on the new position
      if (list.order > newOrder) {
        // Moving list up: increment order of lists between new position and current position
        await prisma.list.updateMany({
          where: {
            boardId,
            order: {
              gte: newOrder,
              lt: list.order,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      } else if (list.order < newOrder) {
        // Moving list down: decrement order of lists between current position and new position
        await prisma.list.updateMany({
          where: {
            boardId,
            order: {
              gt: list.order,
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

      // Update the target list's order
      const updatedList = await prisma.list.update({
        where: {
          id: listId,
        },
        data: {
          order: newOrder,
        },
      });

      return updatedList;
    } catch (error) {
      console.error("ListService.reorder error:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to reorder list", "LIST_REORDER_ERROR");
    }
  },

  /**
   * Copy a list with all its cards
   */
  async copy(listId: string) {
    try {
      // Get the original list with cards
      const originalList = await prisma.list.findUnique({
        where: {
          id: listId,
        },
        include: {
          cards: true,
        },
      });

      if (!originalList) {
        throw new AppError("List not found", "LIST_NOT_FOUND");
      }

      // Find the last list to determine new order
      const lastList = await prisma.list.findFirst({
        where: {
          boardId: originalList.boardId,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });

      const newOrder = lastList ? lastList.order + 1 : 1;

      // Create the new list
      const newList = await prisma.list.create({
        data: {
          title: `${originalList.title} (Copy)`,
          boardId: originalList.boardId,
          order: newOrder,
        },
      });

      // Create copies of all cards
      if (originalList.cards.length > 0) {
        const cardCreateData = originalList.cards.map((card, index) => ({
          title: card.title,
          description: card.description,
          order: index + 1,
          listId: newList.id,
        }));

        await prisma.card.createMany({
          data: cardCreateData,
        });
      }

      // Get the new list with cards
      const listWithCards = await prisma.list.findUnique({
        where: {
          id: newList.id,
        },
        include: {
          cards: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      return listWithCards;
    } catch (error) {
      console.error("ListService.copy error:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to copy list", "LIST_COPY_ERROR");
    }
  },
};
