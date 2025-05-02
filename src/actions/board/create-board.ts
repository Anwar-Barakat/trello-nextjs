"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleServerError } from "@/utils/error.utils";
import { createSuccessResponse } from "@/utils/api.utils";
import { boardFormSchema, type BoardFormSchema } from "@/schemas/board.schema";
import { prisma } from "@/lib/prisma";
import { unsplash } from "@/lib/unsplash";
import type { Board } from "@/types/board.types";
import { incrementAvailableCount } from "@/lib/org-limit";

export const createBoard = async (data: BoardFormSchema) => {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
      code: "UNAUTHORIZED",
      status: 401,
    };
  }

  // Validate the form data
  const validationResult = boardFormSchema.safeParse(data);
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.errors[0]?.message || "Invalid form data";
    return {
      error: errorMessage,
      code: "VALIDATION_ERROR",
      status: 400,
    };
  }

  try {
    // Get image details from Unsplash if an image ID is provided
    let imageDetails = null;
    if (data.image) {
      try {
        const imageResponse = await unsplash.photos.get({
          photoId: data.image,
        });
        if (imageResponse?.response) {
          imageDetails = {
            imageId: imageResponse.response.id,
            imageThumbUrl: imageResponse.response.urls.thumb,
            imageFullUrl: imageResponse.response.urls.full,
            imageUserName: imageResponse.response.user.name,
          };
        }
      } catch (error) {
        console.error("Error fetching image details:", error);
        // Continue with board creation even if image fetch fails
      }
    }

    // Create board in database
    const board = await prisma.board.create({
      data: {
        title: data.title,
        organizationId: orgId,
        imageId: imageDetails?.imageId,
        imageThumbUrl: imageDetails?.imageThumbUrl,
        imageFullUrl: imageDetails?.imageFullUrl,
        imageUserName: imageDetails?.imageUserName,
      },
    });

    // Trigger Unsplash download event (for attribution)
    if (imageDetails?.imageId) {
      try {
        await unsplash.photos.trackDownload({
          downloadLocation: `https://api.unsplash.com/photos/${imageDetails.imageId}/download`,
        });
      } catch (error) {
        // Just log error, don't fail the board creation
        console.error("Error tracking Unsplash download:", error);
      }
    }

    await incrementAvailableCount(orgId);

    // Revalidate cache
    revalidatePath(`/organization/${orgId}`);

    // Return success
    return createSuccessResponse(board as Board);
  } catch (error) {
    return handleServerError(error);
  }
};
