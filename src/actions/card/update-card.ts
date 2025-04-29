"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { cardUpdateSchema, type CardUpdateSchema } from "@/schemas/card.schema";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";

export const updateCard = async (
  cardId: string,
  data: CardUpdateSchema,
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

  // Validate the form data
  const validationResult = cardUpdateSchema.safeParse(data);

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
    const updatedCard = await CardService.update(cardId, data);

    // Revalidate cache
    revalidatePath(`/board/${boardId}`);

    return {
      success: true,
      message: "Card updated successfully",
      data: updatedCard,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
