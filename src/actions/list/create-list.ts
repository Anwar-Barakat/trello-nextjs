"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { createSuccessResponse } from "@/utils/api.utils";
import { listFormSchema, type ListFormSchema } from "@/schemas/list.schema";
import { ListService } from "@/services/list.service";
import type { List } from "@prisma/client";

export const createList = async (data: ListFormSchema) => {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    return {
      success: false,
      message: "Unauthorized",
      code: "UNAUTHORIZED",
      status: 401,
    };
  }

  // Validate the form data
  const validationResult = listFormSchema.safeParse(data);

  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.errors[0]?.message || "Invalid form data";
    return {
      success: false,
      message: errorMessage,
      code: "VALIDATION_ERROR",
      status: 400,
    };
  }

  try {
    const list = await ListService.create(data);

    // Revalidate cache
    revalidatePath(`/board/${data.boardId}`);

    return {
      success: true,
      message: "List created successfully",
      data: list,
    };
  } catch (error) {
    return handleServerError(error);
  }
};
