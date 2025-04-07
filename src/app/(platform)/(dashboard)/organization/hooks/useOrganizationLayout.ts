"use client";

import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import useOrganizationIdStore from "../stores/organizationId.store";

/**
 * Custom hook for organization layout logic
 * Handles responsive behavior and state management
 */
export const useOrganizationLayout = () => {
  const {
    isMounted,
    isSheetOpen,
    isCollapsed,
    setIsMounted,
    setIsSheetOpen,
    setIsCollapsed,
  } = useOrganizationIdStore();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Handle component mount
  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  return {
    isMounted,
    isDesktop,
    isSheetOpen,
    isCollapsed,
    setIsSheetOpen,
    setIsCollapsed,
  };
};
