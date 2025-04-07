import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SidebarStore = {
  expanded: Record<string, boolean>;
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
  onExpandMultiple: (ids: string[]) => void;
};

const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      expanded: {},
      onExpand: (id) => set((state) => ({ expanded: { ...state.expanded, [id]: true } })),
      onCollapse: (id) => set((state) => ({ expanded: { ...state.expanded, [id]: false } })),
      onExpandMultiple: (ids) => set((state) => ({ expanded: ids.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<string, boolean>) })),
    }),
    {
      name: "sidebar-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSidebarStore;
