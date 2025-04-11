'use client'

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import useSidebarStore from "../../stores/sidebar.store"
import NavItem from "./nav-item"
import { Organization } from "@/types/organization.types"
import { cn } from "@/lib/utils"

type SidebarProps = {
    storageKey?: string
    className?: string
}

const Sidebar = ({
    storageKey = 't-sidebar-state',
    className
}: SidebarProps) => {
    const { expanded, onExpandMultiple } = useSidebarStore()
    const { organization: activeOrganization, isLoaded: isOrgLoaded } = useOrganization()
    const { userMemberships, isLoaded: isOrgListLoaded } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    })

    const defaultAccordionValue = useMemo(() => {
        return Object.entries(expanded)
            .filter(([_, isExpanded]) => isExpanded)
            .map(([id]) => id)
    }, [expanded])

    const isLoading = !isOrgLoaded || !isOrgListLoaded || userMemberships.isLoading

    const handleExpand = (value: string[]) => {
        onExpandMultiple(value)
    }

    if (isLoading) {
        return (
            <div className={cn("h-full flex flex-col", className)}>
                <div className="flex items-center justify-between px-4 py-3 mb-2 border-b border-[var(--sidebar-border)]">
                    <Skeleton className="h-4 w-32 bg-[var(--sidebar-accent)]" />
                    <Skeleton className="h-8 w-8 rounded-full bg-[var(--sidebar-accent)]" />
                </div>
                <div className="space-y-2 px-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-x-2 p-2">
                            <Skeleton className="h-5 w-5 rounded-full bg-[var(--sidebar-accent)]" />
                            <Skeleton className="h-4 flex-1 bg-[var(--sidebar-accent)]" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={cn("h-full flex flex-col", className)}>
            <div className="flex items-center justify-between px-4 py-3 mb-2 border-b border-[var(--sidebar-border)]">
                <span className="text-sm font-semibold uppercase tracking-wider text-[var(--sidebar-muted-foreground)]">
                    Workspaces
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto rounded-full p-2 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] transition-colors"
                    asChild
                >
                    <Link href="/select-org">
                        <Plus className="h-4 w-4 transform transition-transform hover:rotate-90" />
                        <span className="sr-only">Create new workspace</span>
                    </Link>
                </Button>
            </div>

            {userMemberships.data && userMemberships.data.length > 0 ? (
                <Accordion
                    type="multiple"
                    defaultValue={defaultAccordionValue}
                    onValueChange={handleExpand}
                    className="space-y-2 overflow-y-auto flex-1"
                >
                    {userMemberships.data.map(({ organization }) => (
                        <NavItem
                            key={organization.id}
                            isActive={activeOrganization?.id === organization.id}
                            isExpanded={!!expanded[organization.id]}
                            organization={organization as Organization}
                            onExpand={handleExpand}
                        />
                    ))}
                </Accordion>
            ) : (
                <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
                    <p className="text-sm text-[var(--sidebar-muted-foreground)]">
                        No workspaces found
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        asChild
                    >
                        <Link href="/select-org">
                            Create a workspace
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Sidebar