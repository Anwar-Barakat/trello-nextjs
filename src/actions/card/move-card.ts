"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/actions/audit-log/create-audit-log";

interface MoveCardProps {
  cardId: string;
  sourceListId: string;
  targetListId: string;
  newOrder: number;
}

export const moveCard = async ({
  cardId,
  sourceListId,
  targetListId,
  newOrder,
}: MoveCardProps) => {
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
        listId: sourceListId,
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

    // Check if target list exists and belongs to the same board
    const targetList = await prisma.list.findFirst({
      where: {
        id: targetListId,
        boardId: card.list.boardId,
        board: {
          organizationId: orgId,
        },
      },
      select: {
        id: true,
        title: true,
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

    // Move the card
    await CardService.move(cardId, sourceListId, targetListId, newOrder);

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
      message: `Card moved from "${card?.list?.title}" to "${targetList?.title}"`,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
