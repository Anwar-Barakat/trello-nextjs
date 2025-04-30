import { AppError } from "@/types/error.types";

/**
 * Handles server errors consistently across the application
 * @param error The error to handle
 * @returns A standardized error response
 */
export const handleServerError = (error: unknown) => {
  console.error("Server error:", error);

  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      status: error.statusCode || 500,
    };
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    let code = "SERVER_ERROR";
    let status = 500;

    // Infer more specific error types based on message
    if (error.message.includes("not found")) {
      code = "NOT_FOUND";
      status = 404;
    } else if (error.message.includes("already exists")) {
      code = "CONFLICT";
      status = 409;
    } else if (error.message.includes("validation")) {
      code = "VALIDATION_ERROR";
      status = 400;
    } else if (
      error.message.includes("unauthorized") ||
      error.message.includes("permission")
    ) {
      code = "UNAUTHORIZED";
      status = 401;
    } else if (error.message.includes("forbidden")) {
      code = "FORBIDDEN";
      status = 403;
    }

    return {
      success: false,
      message: error.message,
      code,
      status,
    };
  }

  // Default generic error
  return {
    success: false,
    message: "An unexpected error occurred",
    code: "SERVER_ERROR",
    status: 500,
  };
};
