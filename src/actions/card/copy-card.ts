"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";

export const copyCard = async (
  cardId: string,
  boardId: string,
  targetListId?: string
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

  // Validate the card exists and belongs to the user's organization
  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      list: {
        board: {
          organizationId: orgId,
        },
      },
    },
  });

  if (!card) {
    return {
      success: false,
      message: "Card not found or you don't have access",
      code: "NOT_FOUND",
      status: 404,
    };
  }

  // If target list is provided, validate it belongs to the same organization
  if (targetListId) {
    const targetList = await prisma.list.findFirst({
      where: {
        id: targetListId,
        board: {
          organizationId: orgId,
        },
      },
    });

    if (!targetList) {
      return {
        success: false,
        message: "Target list not found or you don't have access",
        code: "NOT_FOUND",
        status: 404,
      };
    }
  }

  try {
    const copiedCard = await CardService.copy(cardId, targetListId);

    // Revalidate cache
    revalidatePath(`/board/${boardId}`);

    return {
      success: true,
      message: "Card copied successfully",
      data: copiedCard,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
