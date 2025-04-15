import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createUnsplashSlice,
  type UnsplashSlice,
} from "./slices/unsplash-slice";

const useUnsplashStore = create<UnsplashSlice>()(
  persist(
    (...args) => ({
      ...createUnsplashSlice(...args),
    }),
    {
      name: "unsplash",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist the selectedImageId, not the fetched images
        selectedImageId: state.selectedImageId,
      }),
    }
  )
);

export default useUnsplashStore;
