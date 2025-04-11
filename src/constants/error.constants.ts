/**
 * Error codes for the application
 */
export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL_ERROR: "INTERNAL_ERROR",

  // Board specific errors
  BOARD_CREATE_ERROR: "BOARD_CREATE_ERROR",
  BOARD_DELETE_ERROR: "BOARD_DELETE_ERROR",
  BOARD_LIST_ERROR: "BOARD_LIST_ERROR",
  BOARD_UPDATE_ERROR: "BOARD_UPDATE_ERROR",
  BOARD_NOT_FOUND: "BOARD_NOT_FOUND",
};

/**
 * Error messages for the application
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: "You are not authorized to perform this action",
  [ERROR_CODES.INTERNAL_ERROR]: "An unexpected error occurred",

  [ERROR_CODES.BOARD_CREATE_ERROR]: "Failed to create board",
  [ERROR_CODES.BOARD_DELETE_ERROR]: "Failed to delete board",
  [ERROR_CODES.BOARD_LIST_ERROR]: "Failed to list boards",
  [ERROR_CODES.BOARD_UPDATE_ERROR]: "Failed to update board",
  [ERROR_CODES.BOARD_NOT_FOUND]: "Board not found",
};
