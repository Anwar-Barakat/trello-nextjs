"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { BoardService } from "@/services/board.service";
import { handleServerError } from "@/utils/error.utils";
import type { Board } from "@/types/board.types";

/**
 * Server action to delete a board
 */
export const deleteBoard = async (boardId: string) => {
  const { orgId, userId } = await auth();

  if (!userId) {
    return {
      error: "Unauthorized",
      code: "UNAUTHORIZED",
      status: 401,
    };
  }

  try {
    // Delete board from database
    const deletedBoard = await BoardService.delete(boardId);

    // Revalidate cache
    if (orgId) {
      revalidatePath(`/organization/${orgId}`);
    }

    // Return success
    return {
      data: deletedBoard as Board,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
