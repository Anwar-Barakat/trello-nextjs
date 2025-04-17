import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import useUnsplashStore from "@/stores/unsplash.store";
import { getUnsplashImages } from "@/actions/unsplash/get-unsplash-images";

/**
 * Custom hook for managing Unsplash images
 */
export const useUnsplashImages = () => {
  const { images, isLoading, error, setIsLoading, setError, setImages } =
    useUnsplashStore();

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getUnsplashImages();

      if (result.error) {
        setError(result.error);
        toast.error(result.error, {
          duration: 4000,
          position: "top-center",
        });
        return;
      }

      if (result.data) {
        setImages(result.data);
      }
    } catch (err) {
      console.error("Error fetching Unsplash images:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch images";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, setImages]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    isLoading,
    error,
    refetch: fetchImages,
  };
};
