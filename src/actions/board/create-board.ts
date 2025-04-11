"use server";

import { revalidatePath } from "next/cache";
import { BoardService } from "@/services/board.service";
import { handleServerError } from "@/utils/error.utils";
import { createSuccessResponse } from "@/utils/api.utils";
import type { Board } from "@/types/board.types";
import { ERROR_CODES } from "@/constants/error.constants";
import { withAuth } from "@/middlewares/with-auth";
import type { BoardFormSchema } from "@/schemas/board.schema";

/**
 * Server action to create a new board with auth middleware
 */
export const createBoard = withAuth(
  async (userId, orgId, data: BoardFormSchema) => {
    if (!orgId) {
      return {
        error: "Organization ID is required",
        code: ERROR_CODES.UNAUTHORIZED,
        status: 400,
      };
    }

    try {
      // Create board in database
      const board = await BoardService.create(data, orgId);

      // Revalidate cache
      revalidatePath(`/organization/${orgId}`);

      // Return success
      return createSuccessResponse(board as Board);
    } catch (error) {
      return handleServerError(error);
    }
  }
);
