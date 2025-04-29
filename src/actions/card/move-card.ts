"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { cardMoveSchema, type CardMoveSchema } from "@/schemas/card.schema";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";

export const moveCard = async (data: CardMoveSchema) => {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    return {
      success: false,
      message: "Unauthorized",
      code: "UNAUTHORIZED",
      status: 401,
    };
  }

  // Validate both lists exist and belong to the user's organization
  const [sourceList, targetList] = await Promise.all([
    prisma.list.findFirst({
      where: {
        id: data.sourceListId,
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
    }),
    prisma.list.findFirst({
      where: {
        id: data.targetListId,
        board: {
          organizationId: orgId,
        },
      },
    }),
  ]);

  if (!sourceList || !targetList) {
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
  const validationResult = cardMoveSchema.safeParse(data);

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
    const updatedCard = await CardService.move(
      data.cardId,
      data.sourceListId,
      data.targetListId,
      data.newOrder
    );

    // Revalidate cache
    revalidatePath(`/board/${sourceList.board.id}`);

    return {
      success: true,
      message: "Card moved successfully",
      data: updatedCard,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
