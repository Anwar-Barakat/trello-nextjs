"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { cardUpdateSchema, type CardUpdateSchema } from "@/schemas/card.schema";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/actions/audit-log/create-audit-log";

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

  try {
    // Validate the card exists and belongs to this organization
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
        list: {
          select: {
            boardId: true,
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

    // Update the card
    const updatedCard = await CardService.update(cardId, data);

    // Create an audit log entry with string values instead of enums
    await createAuditLog({
      entityId: cardId,
      entityType: "CARD",
      action: "UPDATE",
      organizationId: orgId,
    });

    // Revalidate the board page to reflect changes
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
