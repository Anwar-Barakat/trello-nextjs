"use server";

import { auth } from "@clerk/nextjs/server";
import { BoardService } from "@/services/board.service";
import type { Board } from "@/types/board.types";

export const listBoard = async () => {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    return [];
  }

  try {
    // Get boards from database
    const boards = await BoardService.list(orgId);

    // Return boards
    return boards as Board[];
  } catch (error) {
    console.error("Error listing boards:", error);
    return [];
  }
};
