'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Menu } from 'lucide-react'
import Sidebar from '../../_components/layouts/sidebar'

interface DesktopNavigationProps {
    children: React.ReactNode
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
    children,
    isCollapsed,
    setIsCollapsed
}) => {
    return (
        <div className="h-full pt-20">
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full mx-auto px-4 md:px-6"
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

export default DesktopNavigation