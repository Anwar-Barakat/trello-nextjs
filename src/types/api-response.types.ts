/**
 * Generic API success response
 */
export interface ApiSuccessResponse<T> {
  data: T;
  status: number;
}

/**
 * Generic API error response
 */
export interface ApiErrorResponse {
  error: string;
  code: string;
  status: number;
}

/**
 * Generic API response (either success or error)
 */
export type ApiResponse<T> =
  | { data: T; error?: never; code?: never; status?: number }
  | { data?: never; error: string; code: string; status: number };
