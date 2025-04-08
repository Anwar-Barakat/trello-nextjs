'use client'

import { useOrganizationLayout } from './hooks/useOrganizationLayout'
import MobileNavigation from './_components/mobile-navigation'
import DesktopNavigation from './_components/desktop-navigation'

type OrganizationLayoutProps = {
    children: React.ReactNode
}

const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
    const {
        isMounted,
        isDesktop,
        isSheetOpen,
        isCollapsed,
        setIsSheetOpen,
        setIsCollapsed
    } = useOrganizationLayout()

    // Handle loading state
    if (!isMounted) return null

    // Mobile layout
    if (!isDesktop) {
        return (
            <div className="h-full w-full px-4 flex flex-col">
                <MobileNavigation
                    isSheetOpen={isSheetOpen}
                    setIsSheetOpen={setIsSheetOpen}
                />

                <div className="flex-1 overflow-auto m-0">
                    {children}
                </div>
            </div>
        )
    }

    // Desktop layout with resizable sidebar
    return (
        <DesktopNavigation
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
        >
            {children}
        </DesktopNavigation>
    )
}

export default OrganizationLayout