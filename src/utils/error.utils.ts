import { AppError, type ErrorResponse } from "@/types/error.types";

/**
 * Standardized error handler for server actions
 */
export const handleServerError = (error: unknown): ErrorResponse => {
  console.error("[SERVER_ERROR]", error);

  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      status: error.status,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      code: "INTERNAL_ERROR",
      status: 500,
    };
  }

  return {
    error: "An unexpected error occurred",
    code: "INTERNAL_ERROR",
    status: 500,
  };
};
