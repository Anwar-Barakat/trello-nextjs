import { create } from "zustand";

interface OrganizationIdStoreState {
  isMounted: boolean;
  isSheetOpen: boolean;
  isCollapsed: boolean;
  setIsMounted: (value: boolean) => void;
  setIsSheetOpen: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

const useOrganizationIdStore = create<OrganizationIdStoreState>((set) => ({
  isMounted: false,
  isSheetOpen: false,
  isCollapsed: false,
  setIsMounted: (value) => set({ isMounted: value }),
  setIsSheetOpen: (value) => set({ isSheetOpen: value }),
  setIsCollapsed: (value) => set({ isCollapsed: value }),
}));

export default useOrganizationIdStore;
