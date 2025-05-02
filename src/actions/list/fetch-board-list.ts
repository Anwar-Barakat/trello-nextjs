"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListService } from "@/services/list.service";
import { handleServerError } from "@/utils/error.utils";
import { prisma } from "@/lib/prisma";
import type { ListWithCards } from "@/types/list-card.types";

export const fetchBoardLists = async (
  boardId: string
): Promise<ListWithCards[]> => {
  const { orgId } = await auth();

  if (!orgId) {
    redirect("/select-org");
  }

  // Validate the board exists and belongs to the user's organization
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      organizationId: orgId,
    },
  });

  if (!board) {
    redirect("/");
  }

  try {
    const lists = await ListService.getByBoardId(boardId);
    return lists;
  } catch (error) {
    console.error("Error fetching board lists:", error);
    return [];
  }
};

export default fetchBoardLists;
