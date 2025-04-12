import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSidebarSlice } from "./slices/sidebar-slice";
import type { SidebarSlice } from "./slices/sidebar-slice";

/**
 * Sidebar store using Zustand with persistence
 */
const useSidebarStore = create<SidebarSlice>()(
  persist(
    (...args) => ({
      ...createSidebarSlice(...args),
    }),
    {
      name: "sidebar-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ expanded: state.expanded }),
    }
  )
);

/**
 * Custom selectors for better performance
 */
export const useExpanded = () => useSidebarStore((state) => state.expanded);
export const useExpandedItem = (id: string) =>
  useSidebarStore((state) => state.expanded[id] ?? false);

export default useSidebarStore;
