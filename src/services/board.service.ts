import { AppError } from "@/types/error.types";
import { prisma } from "../lib/prisma";
import type { BoardFormSchema } from "@/app/(platform)/(dashboard)/organization/[organizationId]/schema";

export const BoardService = {
  /**
   * Create a new board
   */
  async create(data: BoardFormSchema, organizationId: string) {
    try {
      const board = await prisma.board.create({
        data: {
          title: data.title,
          organizationId,
        },
      });

      return board;
    } catch (error) {
      console.error("boardService.create error:", error);
      throw new AppError("Failed to create board", "BOARD_CREATE_ERROR");
    }
  },

  /**
   * Delete a board by ID
   */
  async delete(boardId: string) {
    try {
      const deletedBoard = await prisma.board.delete({
        where: {
          id: boardId,
        },
      });

      return deletedBoard;
    } catch (error) {
      console.error("boardService.delete error:", error);
      throw new AppError("Failed to delete board", "BOARD_DELETE_ERROR");
    }
  },

  /**
   * List all boards for an organization
   */
  async list(organizationId: string) {
    try {
      const boards = await prisma.board.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return boards;
    } catch (error) {
      console.error("boardService.list error:", error);
      throw new AppError("Failed to list boards", "BOARD_LIST_ERROR");
    }
  },
};
