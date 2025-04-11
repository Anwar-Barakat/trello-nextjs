"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const deleteBoard = async (boardId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const deletedBoard = await prisma.board.delete({
      where: {
        id: boardId,
      },
    });

    return deletedBoard;
  } catch (error) {
    console.log("[BOARD_DELETE]", error);
    return { error: "Failed to delete board" };
  }
};
