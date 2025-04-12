import { useEffect } from 'react';
import useOrganizationStore from '@/stores/organization.store';

/**
 * Custom hook for organization UI state management
 */
export const useOrganization = () => {
  const { 
    isMounted, 
    isSheetOpen, 
    isCollapsed, 
    setIsMounted, 
    setIsSheetOpen, 
    setIsCollapsed 
  } = useOrganizationStore();

  // Set isMounted to true on component mount
  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      // Clean up when component unmounts
      setIsMounted(false);
    };
  }, [setIsMounted]);

  /**
   * Toggle sheet open/closed
   */
  const toggleSheet = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  /**
   * Toggle sidebar collapse state
   */
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return {
    isMounted,
    isSheetOpen,
    isCollapsed,
    setIsMounted,
    setIsSheetOpen,
    setIsCollapsed,
    toggleSheet,
    toggleCollapse,
  };
};