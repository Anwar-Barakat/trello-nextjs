"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";

export const deleteCard = async (cardId: string, boardId: string) => {
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
    include: {
      list: true,
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

  try {
    await CardService.delete(cardId);

    // Revalidate cache
    revalidatePath(`/board/${boardId}`);

    return {
      success: true,
      message: "Card deleted successfully",
    };
  } catch (error) {
    return handleServerError(error);
  }
};
