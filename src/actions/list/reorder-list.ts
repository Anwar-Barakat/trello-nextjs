"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import {
  listReorderSchema,
  type ListReorderSchema,
} from "@/schemas/list.schema";
import { ListService } from "@/services/list.service";
import { prisma } from "@/lib/prisma";

export const reorderList = async (data: ListReorderSchema) => {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    return {
      success: false,
      message: "Unauthorized",
      code: "UNAUTHORIZED",
      status: 401,
    };
  }

  // Validate that the board belongs to the organization
  const board = await prisma.board.findFirst({
    where: {
      id: data.boardId,
      organizationId: orgId,
    },
  });

  if (!board) {
    return {
      success: false,
      message: "Board not found or you don't have access",
      code: "NOT_FOUND",
      status: 404,
    };
  }

  // Validate the form data
  const validationResult = listReorderSchema.safeParse(data);

  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.errors[0]?.message || "Invalid form data";
    return {
      success: false,
      message: errorMessage,
      code: "VALIDATION_ERROR",
      status: 400,
    };
  }

  try {
    const updatedList = await ListService.reorder(
      data.listId,
      data.newOrder,
      data.boardId
    );

    // Revalidate cache
    revalidatePath(`/board/${data.boardId}`);

    return {
      success: true,
      message: "List reordered successfully",
      data: updatedList,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
