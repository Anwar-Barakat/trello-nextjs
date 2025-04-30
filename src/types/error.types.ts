/**
 * Standard application error class that can be extended for specific error types
 */
export class AppError extends Error {
  code: string;
  statusCode?: number;

  constructor(message: string, code: string, statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Board-related errors
export class BoardNotFoundError extends AppError {
  constructor(boardId: string) {
    super(`Board with ID ${boardId} not found`, "BOARD_NOT_FOUND", 404);
  }
}

export class BoardAccessDeniedError extends AppError {
  constructor() {
    super(
      "You do not have permission to access this board",
      "BOARD_ACCESS_DENIED",
      403
    );
  }
}

// List-related errors
export class ListNotFoundError extends AppError {
  constructor(listId: string) {
    super(`List with ID ${listId} not found`, "LIST_NOT_FOUND", 404);
  }
}

export class ListAccessDeniedError extends AppError {
  constructor() {
    super(
      "You do not have permission to access this list",
      "LIST_ACCESS_DENIED",
      403
    );
  }
}

export class ListCreateError extends AppError {
  constructor(message = "Failed to create list") {
    super(message, "LIST_CREATE_ERROR", 500);
  }
}

export class ListUpdateError extends AppError {
  constructor(message = "Failed to update list") {
    super(message, "LIST_UPDATE_ERROR", 500);
  }
}

export class ListDeleteError extends AppError {
  constructor(message = "Failed to delete list") {
    super(message, "LIST_DELETE_ERROR", 500);
  }
}

export class ListReorderError extends AppError {
  constructor(message = "Failed to reorder list") {
    super(message, "LIST_REORDER_ERROR", 500);
  }
}

// Card-related errors
export class CardNotFoundError extends AppError {
  constructor(cardId: string) {
    super(`Card with ID ${cardId} not found`, "CARD_NOT_FOUND", 404);
  }
}

export class CardAccessDeniedError extends AppError {
  constructor() {
    super(
      "You do not have permission to access this card",
      "CARD_ACCESS_DENIED",
      403
    );
  }
}

export class CardCreateError extends AppError {
  constructor(message = "Failed to create card") {
    super(message, "CARD_CREATE_ERROR", 500);
  }
}

export class CardUpdateError extends AppError {
  constructor(message = "Failed to update card") {
    super(message, "CARD_UPDATE_ERROR", 500);
  }
}

export class CardDeleteError extends AppError {
  constructor(message = "Failed to delete card") {
    super(message, "CARD_DELETE_ERROR", 500);
  }
}

export class CardReorderError extends AppError {
  constructor(message = "Failed to reorder card") {
    super(message, "CARD_REORDER_ERROR", 500);
  }
}

export class CardMoveError extends AppError {
  constructor(message = "Failed to move card") {
    super(message, "CARD_MOVE_ERROR", 500);
  }
}

// Authentication and authorization errors
export class UnauthorizedError extends AppError {
  constructor(message = "You are not authorized to perform this action") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, "FORBIDDEN", 403);
  }
}

// Validation errors
export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400);
  }
}

// Other generic errors
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, "CONFLICT", 409);
  }
}

export class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, "SERVER_ERROR", 500);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database error occurred") {
    super(message, "DATABASE_ERROR", 500);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded") {
    super(message, "RATE_LIMIT_EXCEEDED", 429);
  }
}
