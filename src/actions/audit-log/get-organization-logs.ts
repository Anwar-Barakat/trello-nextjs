"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { handleServerError } from "@/utils/error.utils";

/**
 * Get recent audit logs for the organization
 */
export const getOrganizationLogs = async (
  organizationId: string,
  limit = 5
) => {
  try {
    const { orgId, userId } = auth();

    if (!userId || !orgId) {
      return {
        success: false,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        status: 401,
      };
    }

    // Ensure the requested organization ID matches the authenticated organization
    if (orgId !== organizationId) {
      return {
        success: false,
        message: "Organization ID mismatch",
        code: "UNAUTHORIZED",
        status: 401,
      };
    }

    // Fetch recent audit logs
    const logs = await prisma.auditLog.findMany({
      where: {
        organizationId: orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    });

    return {
      success: true,
      data: logs,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
