export const MAX_FREE_BOARDS = 5;

export const BOARD_ERRORS = {
  UNAUTHORIZED: "Unauthorized: No organization ID found",
  ORG_MISMATCH: "Unauthorized: Organization ID mismatch",
  LIMIT_REACHED: "Board limit reached",
  BELOW_ZERO: "Cannot decrement below zero",
  INCREMENT_FAILED: "Failed to increment board count",
  DECREMENT_FAILED: "Failed to decrement board count",
  CHECK_FAILED: "Failed to check available board count",
  GET_COUNT_FAILED: "Failed to get available board count",
} as const;

export const BOARD_VALIDATION = {
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 50,
  TITLE_PATTERN: /^[a-zA-Z0-9\s\-_]+$/,
} as const;
