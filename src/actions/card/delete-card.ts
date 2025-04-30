"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { CardService } from "@/services/card.service";
import { prisma } from "@/lib/prisma";
// Removed dependency on Prisma enums
import { createAuditLog } from "@/actions/audit-log/create-audit-log";

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

    // Delete the card
    await CardService.delete(cardId);

    // Create an audit log entry with string values instead of enums
    await createAuditLog({
      entityId: cardId,
      entityType: "CARD",
      action: "DELETE",
      organizationId: orgId,
    });

    // Revalidate the board page to reflect changes
    revalidatePath(`/board/${boardId}`);

    return {
      success: true,
      message: `Card deleted from ${card.list.title}`,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
