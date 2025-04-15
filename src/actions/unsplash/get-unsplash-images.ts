"use server";

import { unsplash } from "@/lib/unsplash";
import {
  UNSPLASH_COLLECTION_ID,
  UNSPLASH_IMAGE_COUNT,
} from "@/constants/unsplash.constants";
import { handleServerError } from "@/utils/error.utils";
import { createSuccessResponse } from "@/utils/api.utils";
import type { UnsplashImage } from "@/stores/slices/unsplash-slice";
import { withAuth } from "@/middlewares/with-auth";

/**
 * Server action to fetch random images from Unsplash with auth middleware
 */
export const getUnsplashImages = withAuth(async (userId, orgId) => {
  try {
    const result = await unsplash.photos.getRandom({
      collectionIds: [UNSPLASH_COLLECTION_ID],
      count: UNSPLASH_IMAGE_COUNT,
    });

    if (!result?.response) {
      return {
        error: "Failed to fetch images from Unsplash",
        code: "UNSPLASH_ERROR",
        status: 500,
      };
    }

    // Convert to array if response is a single object
    const images = Array.isArray(result.response)
      ? (result.response as UnsplashImage[])
      : [result.response as UnsplashImage];

    return createSuccessResponse(images);
  } catch (error) {
    return handleServerError(error);
  }
});
