import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarState {
  expanded: Record<string, boolean>;
}

interface SidebarActions {
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
  onExpandMultiple: (ids: string[]) => void;
  onExpandToggle: (id: string) => void;
  onReset: () => void;
}

type SidebarStore = SidebarState & SidebarActions;

const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      // State
      expanded: {},

      // Actions
      onExpand: (id) =>
        set((state) => ({
          expanded: { ...state.expanded, [id]: true },
        })),

      onCollapse: (id) =>
        set((state) => ({
          expanded: { ...state.expanded, [id]: false },
        })),

      onExpandMultiple: (ids) =>
        set(() => ({
          expanded: ids.reduce((acc, id) => {
            acc[id] = true;
            return acc;
          }, {} as Record<string, boolean>),
        })),

      onExpandToggle: (id) =>
        set((state) => ({
          expanded: {
            ...state.expanded,
            [id]: !state.expanded[id],
          },
        })),

      onReset: () =>
        set({
          expanded: {},
        }),
    }),
    {
      name: "sidebar-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ expanded: state.expanded }),
    }
  )
);

export default useSidebarStore;
