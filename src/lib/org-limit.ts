import { MAX_FREE_BOARDS } from "@/constants/board.constants";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const incrementAvailableCount = async (organizationId: string) => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgBoardLimit = await prisma.orgBoardLimit.findUnique({
    where: { organizationId: orgId },
  });

  if (orgBoardLimit) {
    await prisma.orgBoardLimit.update({
      where: { organizationId: orgId },
      data: {
        count: orgBoardLimit.count + 1,
      },
    });
  } else {
    await prisma.orgBoardLimit.create({
      data: {
        organizationId: orgId,
        count: 1,
      },
    });
  }
};

export const decrementAvailableCount = async (organizationId: string) => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgBoardLimit = await prisma.orgBoardLimit.findUnique({
    where: { organizationId: orgId },
  });

  if (orgBoardLimit) {
    await prisma.orgBoardLimit.update({
      where: { organizationId: orgId },
      data: {
        count: orgBoardLimit.count - 1,
      },
    });
  }
};

export const hasAvailableCount = async (organizationId: string) => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgBoardLimit = await prisma.orgBoardLimit.findUnique({
    where: { organizationId: orgId },
  });

  if (!orgBoardLimit || orgBoardLimit.count < MAX_FREE_BOARDS) {
    return true;
  }

  return false;
};

export const getAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgBoardLimit = await prisma.orgBoardLimit.findUnique({
    where: { organizationId: orgId },
  });

  if (!orgBoardLimit) {
    return 0;
  }
  return orgBoardLimit.count;
};
