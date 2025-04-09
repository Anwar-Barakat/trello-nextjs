"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { type BoardFormSchema } from "../schema";

export const createBoard = async (data: BoardFormSchema) => {
  const { orgId } = await auth();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const board = await prisma.board.create({
    data: {
      title: data.title,
    },
  });

  return board;
};
