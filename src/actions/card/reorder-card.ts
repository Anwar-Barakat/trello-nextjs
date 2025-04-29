"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { cardReorderSchema, type CardReorderSchema } from "@/schemas/card.schema";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";

export const reorderCard = async (data: CardReorderSchema) => {
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
      id: data.listId,
      board: {
        organizationId: orgId,
      },
    },
    include: {
      board: {
        select: {
          id: true,
        },
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

  // Validate the card exists
  const card = await prisma.card.findUnique({
    where: {
      id: data.cardId,
    },
  });

  if (!card) {
    return {
      success: false,
      message: "Card not found",
      code: "NOT_FOUND",
      status: 404,
    };
  }

  // Validate the form data
  const validationResult = cardReorderSchema.safeParse(data);

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
    const updatedCard = await CardService.reorder(
      data.cardId,
      data.listId,
      data.newOrder
    );

    // Revalidate cache
    revalidatePath(`/board/${list.board.id}`);

    return {
      success: true,
      message: "Card reordered successfully",
      data: updatedCard,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
