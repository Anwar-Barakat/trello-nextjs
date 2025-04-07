'use client'

import React, { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { cn } from "@/lib/utils"

// Import shadcn components
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

// Import custom components
import Sidebar from "../_components/layouts/sidebar"
import { Menu, X } from "lucide-react"

type OrganizationLayoutProps = {
    children: React.ReactNode
}

const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
    const [isMounted, setIsMounted] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 1024px)")

    // Handle component mount
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Skip rendering if not mounted (for hydration)
    if (!isMounted) {
        return null
    }

    // Render different layouts for mobile vs desktop
    if (!isDesktop) {
        return (
            <div className="h-full pt-20 px-4 flex flex-col">
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
                    <SheetContent side="left" className="p-0 pt-20 w-72">
                        <Sidebar storageKey="organization-sidebar" />
                    </SheetContent>
                </Sheet>

                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        )
    }

    // Desktop layout with resizable sidebar
    return (
        <div className="h-full pt-20">
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full max-w-6xl 2xl:max-w-screen-xl mx-auto px-4 md:px-6"
            >
                <ResizablePanel
                    defaultSize={20}
                    minSize={15}
                    maxSize={30}
                    collapsible={true}
                    onCollapse={() => setIsCollapsed(true)}
                    onExpand={() => setIsCollapsed(false)}
                    className={cn(
                        "transition-all duration-300 ease-in-out",
                        isCollapsed ? "min-w-12 w-12" : "min-w-[200px]"
                    )}
                >
                    <div className={cn(
                        "h-full",
                        isCollapsed && "hidden"
                    )}>
                        <Sidebar storageKey="organization-sidebar" />
                    </div>
                    {isCollapsed && (
                        <div className="h-full flex items-center justify-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCollapsed(false)}
                                className="h-8 w-8"
                            >
                                <Menu className="h-4 w-4" />
                                <span className="sr-only">Expand sidebar</span>
                            </Button>
                        </div>
                    )}
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-muted" />

                <ResizablePanel defaultSize={80}>
                    <div className="h-full p-4 overflow-auto">
                        {children}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default OrganizationLayout