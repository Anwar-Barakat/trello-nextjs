"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { handleServerError } from "@/utils/error.utils";

interface CreateAuditLogParams {
  entityId: string;
  entityType: string; // Changed from ENTITY_TYPE enum to string
  action: string; // Changed from AuditLogAction enum to string
  organizationId: string;
}

export const createAuditLog = async (params: CreateAuditLogParams) => {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      throw new Error("User not authenticated");
    }

    const { entityId, entityType, action, organizationId } = params;

    await prisma.auditLog.create({
      data: {
        organizationId,
        entityId,
        entityType,
        action,
        userId,
        userImage: user.imageUrl || "",
        userName: `${user.firstName} ${user.lastName}`,
      },
    });

    return { success: true };
  } catch (error) {
    return handleServerError(error);
  }
};

/**
 * Get audit logs for a specific organization and entity
 */
export const getAuditLogs = async (entityId: string) => {
  try {
    const { orgId } = auth();

    if (!orgId) {
      throw new Error("Organization ID not found");
    }

    const logs = await prisma.auditLog.findMany({
      where: {
        organizationId: orgId as string,
        entityId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to last 10 entries
    });

    return { success: true, data: logs };
  } catch (error) {
    return handleServerError(error);
  }
};
