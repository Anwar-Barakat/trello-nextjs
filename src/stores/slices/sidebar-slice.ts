import type { StateCreator } from "zustand";

export interface SidebarState {
  expanded: Record<string, boolean>;
}

export interface SidebarActions {
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
  onExpandMultiple: (ids: string[]) => void;
  onExpandToggle: (id: string) => void;
  onReset: () => void;
}

export type SidebarSlice = SidebarState & SidebarActions;

export const createSidebarSlice: StateCreator<
  SidebarSlice,
  [],
  [],
  SidebarSlice
> = (set) => ({
  // Initial state
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
});
