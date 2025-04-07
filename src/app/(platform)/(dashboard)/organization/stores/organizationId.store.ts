import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OrganizationIdState {
  isMounted: boolean;
  isSheetOpen: boolean;
  isCollapsed: boolean;
}

interface OrganizationIdActions {
  setIsMounted: (isMounted: boolean) => void;
  setIsSheetOpen: (isSheetOpen: boolean) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const useOrganizationIdStore = create<
  OrganizationIdState & OrganizationIdActions
>()(
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
      name: "organizationId",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useOrganizationIdStore;
