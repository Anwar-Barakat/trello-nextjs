"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { ListService } from "@/services/list.service";
import { prisma } from "@/lib/prisma";

export const deleteList = async (listId: string, boardId: string) => {
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

  try {
    await ListService.delete(listId);

    // Revalidate cache
    revalidatePath(`/board/${boardId}`);

    return {
      success: true,
      message: "List deleted successfully",
    };
  } catch (error) {
    return handleServerError(error);
  }
};
