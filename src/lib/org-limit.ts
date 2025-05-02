import { MAX_FREE_BOARDS } from "@/constants/board.constants";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export class OrgLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrgLimitError";
  }
}

export const incrementAvailableCount = async (organizationId: string) => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new OrgLimitError("Unauthorized: No organization ID found");
  }

  if (orgId !== organizationId) {
    throw new OrgLimitError("Unauthorized: Organization ID mismatch");
  }

  try {
    const orgBoardLimit = await prisma.orgBoardLimit.findUnique({
      where: { organizationId: orgId },
    });

    if (orgBoardLimit) {
      if (orgBoardLimit.count >= MAX_FREE_BOARDS) {
        throw new OrgLimitError("Board limit reached");
      }
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
  } catch (error) {
    if (error instanceof OrgLimitError) {
      throw error;
    }
    throw new OrgLimitError("Failed to increment board count");
  }
};

export const decrementAvailableCount = async (organizationId: string) => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new OrgLimitError("Unauthorized: No organization ID found");
  }

  if (orgId !== organizationId) {
    throw new OrgLimitError("Unauthorized: Organization ID mismatch");
  }

  try {
    const orgBoardLimit = await prisma.orgBoardLimit.findUnique({
      where: { organizationId: orgId },
    });

    if (orgBoardLimit) {
      if (orgBoardLimit.count <= 0) {
        throw new OrgLimitError("Cannot decrement below zero");
      }
      await prisma.orgBoardLimit.update({
        where: { organizationId: orgId },
        data: {
          count: orgBoardLimit.count - 1,
        },
      });
    }
  } catch (error) {
    if (error instanceof OrgLimitError) {
      throw error;
    }
    throw new OrgLimitError("Failed to decrement board count");
  }
};

export const hasAvailableCount = async (organizationId: string) => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new OrgLimitError("Unauthorized: No organization ID found");
  }

  if (orgId !== organizationId) {
    throw new OrgLimitError("Unauthorized: Organization ID mismatch");
  }

  try {
    const orgBoardLimit = await prisma.orgBoardLimit.findUnique({
      where: { organizationId: orgId },
    });

    if (!orgBoardLimit || orgBoardLimit.count < MAX_FREE_BOARDS) {
      return true;
    }

    return false;
  } catch (error) {
    throw new OrgLimitError("Failed to check available board count");
  }
};

export const getAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new OrgLimitError("Unauthorized: No organization ID found");
  }

  try {
    const orgBoardLimit = await prisma.orgBoardLimit.findUnique({
      where: { organizationId: orgId },
    });

    // If no record exists, return MAX_FREE_BOARDS as the available count
    // since the user hasn't created any boards yet
    if (!orgBoardLimit) {
      return MAX_FREE_BOARDS;
    }

    // Return remaining count (MAX_FREE_BOARDS - used count)
    return MAX_FREE_BOARDS - orgBoardLimit.count;
  } catch (error) {
    console.error("Error getting available board count:", error);
    throw new OrgLimitError("Failed to get available board count");
  }
};
