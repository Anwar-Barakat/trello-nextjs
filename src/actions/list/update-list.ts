"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { listUpdateSchema } from "@/schemas/list.schema";
import { ListService } from "@/services/list.service";
import { prisma } from "@/lib/prisma";

export const updateList = async (
  listId: string,
  data: { title?: string },
  boardId: string
) => {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    return {
      success: false,
      message: "Unauthorized",
      code: "UNAUTHORIZED",
      status: 401,
    };
  }

  // Validate the list exists and belongs to the user's organization
  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      board: {
        organizationId: orgId,
      },
    },
  });

  if (!list) {
    return {
      success: false,
      message: "List not found or you don't have access",
      code: "NOT_FOUND",
      status: 404,
    };
  }

  // Validate the form data
  const validationResult = listUpdateSchema.safeParse(data);

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
    const updatedList = await ListService.update(listId, data);

    // Revalidate cache
    revalidatePath(`/board/${boardId}`);

    return {
      success: true,
      message: "List updated successfully",
      data: updatedList,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
