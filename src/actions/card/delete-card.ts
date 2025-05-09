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

    // Store the card's list title and boardId for the success message
    const listTitle = card.list.title;
    const cardBoardId = card.list.boardId;

    try {
      // Delete the card
      await CardService.delete(cardId);

      // Create an audit log entry
      await createAuditLog({
        entityId: cardId,
        entityType: "CARD",
        action: "DELETE",
        organizationId: orgId,
      });
    } catch (deleteError) {
      console.error("Error during card deletion:", deleteError);

      // Check if it's a NOT_FOUND error
      if (
        deleteError instanceof Error &&
        deleteError.message?.includes("not found")
      ) {
        return {
          success: false,
          message: "Card not found. It may have been deleted already.",
          code: "NOT_FOUND",
          status: 404,
        };
      }

      return {
        success: false,
        message: "Failed to delete card. Please try again.",
        code: "DELETE_ERROR",
        status: 500,
      };
    }

    // Revalidate all paths to ensure UI updates correctly
    revalidatePath(`/board/${cardBoardId}`);
    revalidatePath(`/organization/${orgId}/board/${cardBoardId}`);

    // If a boardId was passed that's different from the card's list boardId,
    // also revalidate that path (in case of cross-board operations)
    if (boardId && boardId !== cardBoardId) {
      revalidatePath(`/board/${boardId}`);
    }

    return {
      success: true,
      message: `Card deleted from ${listTitle}`,
    };
  } catch (error) {
    console.error("Error deleting card:", error);
    return handleServerError(error);
  }
};
