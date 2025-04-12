export type Board = {
  id: string;
  title: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export type BoardInput = Pick<Board, "title">;

export interface BoardResponse {
  data?: Board;
  error?: string;
}

export interface BoardListResponse {
  data?: Board[];
  error?: string;
}
