import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface OrganizationState {
  isMounted: boolean;
  isSheetOpen: boolean;
  isCollapsed: boolean;
}

export interface OrganizationActions {
  setIsMounted: (isMounted: boolean) => void;
  setIsSheetOpen: (isSheetOpen: boolean) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const useOrganizationStore = create<OrganizationState & OrganizationActions>()(
  persist(
    (set) => ({
      isMounted: false,
      isSheetOpen: false,
      isCollapsed: false,
      setIsMounted: (isMounted: boolean) => set({ isMounted }),
      setIsSheetOpen: (isSheetOpen: boolean) => set({ isSheetOpen }),
      setIsCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
    }),
    {
      name: "organization",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useOrganizationStore;
import type { StateCreator } from "zustand";

export interface OrganizationState {
  isMounted: boolean;
  isSheetOpen: boolean;
  isCollapsed: boolean;
}

export interface OrganizationActions {
  setIsMounted: (isMounted: boolean) => void;
  setIsSheetOpen: (isSheetOpen: boolean) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export type OrganizationSlice = OrganizationState & OrganizationActions;

export const createOrganizationSlice: StateCreator<
  OrganizationSlice,
  [],
  [],
  OrganizationSlice
> = (set) => ({
  // Initial state
  isMounted: false,
  isSheetOpen: false,
  isCollapsed: false,

  // Actions
  setIsMounted: (isMounted) => set({ isMounted }),
  setIsSheetOpen: (isSheetOpen) => set({ isSheetOpen }),
  setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
});
