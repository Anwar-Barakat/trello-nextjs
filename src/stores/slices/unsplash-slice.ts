import type { StateCreator } from "zustand";

export interface UnsplashImage {
  id: string;
  urls: {
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    html: string;
  };
  user: {
    name: string;
    username?: string;
  };
  alt_description?: string;
  description?: string;
}

export interface UnsplashState {
  images: UnsplashImage[];
  isLoading: boolean;
  error: string | null;
  selectedImageId: string | null;
}

export interface UnsplashActions {
  setImages: (images: UnsplashImage[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedImageId: (selectedImageId: string | null) => void;
  reset: () => void;
}

export type UnsplashSlice = UnsplashState & UnsplashActions;

const initialState: UnsplashState = {
  images: [],
  isLoading: false,
  error: null,
  selectedImageId: null,
};

export const createUnsplashSlice: StateCreator<UnsplashSlice> = (set) => ({
  ...initialState,
  setImages: (images) => set({ images }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedImageId: (selectedImageId) => set({ selectedImageId }),
  reset: () => set(initialState),
});
