import { auth } from "@clerk/nextjs/server";
import { createErrorResponse } from "@/utils/api.utils";
import { ERROR_CODES } from "@/constants/error.constants";
import type { ApiResponse } from "@/types/api-response.types";

/**
 * Higher-order function to wrap server actions with authentication
 */
export function withAuth<T, P extends unknown[]>(
  handler: (
    userId: string,
    orgId: string | null,
    ...args: P
  ) => Promise<ApiResponse<T>>
) {
  return async (...args: P): Promise<ApiResponse<T>> => {
    const { userId, orgId } = await auth();

    if (!userId) {
      return createErrorResponse("Unauthorized", ERROR_CODES.UNAUTHORIZED, 401);
    }

    return handler(userId, orgId ?? null, ...args);
  };
}
