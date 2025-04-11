"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { BoardFormSchema } from "../schema";
import { revalidatePath } from "next/cache";

export const createBoard = async (data: BoardFormSchema) => {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }
  console.log("Creating board", data);
  try {
    const board = await prisma.board.create({
      data: {
        title: data.title,
        organizationId: orgId,
      },
    });

    // Revalidate the organization page to show the new board
    revalidatePath(`/organization/${orgId}`);

    return board;
  } catch (error) {
    console.error("Error in createBoard:", error);
    throw new Error("Failed to create board", { cause: error });
  }
};
