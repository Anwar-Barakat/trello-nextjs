"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";
import { ENTITY_TYPE, AuditLogAction } from "@prisma/client";
import { createAuditLog } from "@/actions/audit-log/create-audit-log";

interface ReorderCardProps {
  cardId: string;
  listId: string;
  newOrder: number;
}

export const reorderCard = async ({
  cardId,
  listId,
  newOrder,
}: ReorderCardProps) => {
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
        listId,
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

    // Perform the reordering
    await CardService.reorder(cardId, listId, newOrder);

    // Create an audit log entry with string values instead of enums
    await createAuditLog({
      entityId: cardId,
      entityType: "CARD",
      action: "UPDATE",
      organizationId: orgId,
    });

    // Revalidate the board page to reflect changes
    revalidatePath(`/board/${card.list.boardId}`);

    return {
      success: true,
      message: "Card reordered successfully",
    };
  } catch (error) {
    return handleServerError(error);
  }
};
