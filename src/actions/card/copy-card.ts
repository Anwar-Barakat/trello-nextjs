"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";
import { ENTITY_TYPE, AuditLogAction } from "@prisma/client";
import { createAuditLog } from "@/actions/audit-log/create-audit-log";

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
            id: true,
            boardId: true,
            title: true,
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

    // If target list is provided, validate it
    if (targetListId) {
      const targetList = await prisma.list.findFirst({
        where: {
          id: targetListId,
          boardId: card.list.boardId,
          board: {
            organizationId: orgId,
          },
        },
      });

      if (!targetList) {
        return {
          success: false,
          message: "Target list not found or doesn't belong to the same board",
          code: "INVALID_TARGET",
          status: 400,
        };
      }
    }

    // Copy the card
    const newCard = await CardService.copy(cardId, targetListId);

    // Create an audit log entry with string values instead of enums
    await createAuditLog({
      entityId: newCard.id,
      entityType: "CARD",
      action: "CREATE",
      organizationId: orgId,
    });

    // Revalidate the board page to reflect changes
    revalidatePath(`/board/${boardId}`);

    return {
      success: true,
      message: "Card copied successfully",
      data: newCard,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
