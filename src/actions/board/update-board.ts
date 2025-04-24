"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateBoard = async (id: string, data: { title: string }) => {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const board = await prisma.board.update({
    where: {
      id,
      organizationId: orgId,
    },
    data: {
      title: data.title,
    },
  });

  revalidatePath(`/board/${id}`);
  return board;
};
