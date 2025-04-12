/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public code: string;
  public status: number;

  constructor(
    message: string,
    code = "INTERNAL_ERROR",
    status = 500
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;

    // Ensures proper stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error response type for server actions
 */
export interface ErrorResponse {
  error: string;
  code: string;
  status: number;
}
