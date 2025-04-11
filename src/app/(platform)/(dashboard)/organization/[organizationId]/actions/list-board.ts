"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const listBoard = async () => {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    return [];
  }

  try {
    const boards = await prisma.board.findMany({
      where: {
        organizationId: orgId,
      },
      orderBy: {
        title: "asc",
      },
      select: {
        id: true,
        title: true,
        organizationId: true,
      },
    });

    return boards;
  } catch (error) {
    console.error("Error listing boards:", error);
    return [];
  }
};
