export interface Board {
  id: string;
  title: string;
  organizationId: string;
  imageId?: string;
  imageThumbUrl?: string;
  imageFullUrl?: string;
  imageUserName?: string;
  createdAt: Date;
  updatedAt?: Date;
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
