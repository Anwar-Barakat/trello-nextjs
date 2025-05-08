'use client'

import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import Sidebar from '../../_components/layouts/sidebar'

interface MobileNavigationProps {
    isSheetOpen: boolean
    setIsSheetOpen: (value: boolean) => void
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
    isSheetOpen,
    setIsSheetOpen
}) => {
    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed top-[76px] left-4 z-40 lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="p-0 pt-10 w-72"
                title="Organization Navigation"
                description="Access your boards and organization settings"
            >
                <Sidebar storageKey="organization-sidebar" />
            </SheetContent>
        </Sheet>
    )
}

export default MobileNavigation