import { ERROR_CODES, ERROR_MESSAGES } from "@/constants/error.constants";
import type { ApiResponse } from "@/types/api-response.types";
import { AppError } from "@/types/error.types";

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  status = 200
): ApiResponse<T> {
  return {
    data,
    status,
  };
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  error: string | AppError,
  code = ERROR_CODES.INTERNAL_ERROR,
  status = 500
): ApiResponse<never> {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      status: error.status,
    };
  }

  return {
    error:
      typeof error === "string"
        ? error
        : ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR],
    code,
    status,
  };
}

/**
 * Check if a response is an error
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<never> {
  return "error" in response && typeof response.error === "string";
}
