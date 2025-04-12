import { useCallback } from "react";
import useSidebarStore from "@/stores/sidebar.store";

interface UseSidebarProps {
  id?: string;
}

/**
 * Custom hook for sidebar state management
 */
export const useSidebar = ({ id }: UseSidebarProps = {}) => {
  const {
    expanded,
    onExpand,
    onCollapse,
    onExpandMultiple,
    onExpandToggle,
    onReset,
  } = useSidebarStore();

  /**
   * Check if a specific item is expanded
   */
  const isExpanded = useCallback(
    (itemId: string) => {
      return expanded[itemId] ?? false;
    },
    [expanded]
  );

  /**
   * Toggle expansion state for the current item
   */
  const toggleExpansion = useCallback(() => {
    if (id) {
      onExpandToggle(id);
    }
  }, [id, onExpandToggle]);

  /**
   * Expand the current item
   */
  const expand = useCallback(() => {
    if (id) {
      onExpand(id);
    }
  }, [id, onExpand]);

  /**
   * Collapse the current item
   */
  const collapse = useCallback(() => {
    if (id) {
      onCollapse(id);
    }
  }, [id, onCollapse]);

  return {
    expanded,
    isExpanded,
    onExpand,
    onCollapse,
    onExpandMultiple,
    onExpandToggle,
    onReset,
    toggleExpansion,
    expand,
    collapse,
    currentExpanded: id ? expanded[id] ?? false : false,
  };
};

export default useSidebar;
