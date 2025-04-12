import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createOrganizationSlice,
  type OrganizationSlice,
} from "./slices/organization-slice";

/**
 * Organization store using Zustand with persistence
 */
const useOrganizationStore = create<OrganizationSlice>()(
  persist(
    (...args) => ({
      ...createOrganizationSlice(...args),
    }),
    {
      name: "organizationId",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Custom selectors for better performance
 */
export const useIsMounted = () =>
  useOrganizationStore((state) => state.isMounted);
export const useIsSheetOpen = () =>
  useOrganizationStore((state) => state.isSheetOpen);
export const useIsCollapsed = () =>
  useOrganizationStore((state) => state.isCollapsed);

export default useOrganizationStore;
