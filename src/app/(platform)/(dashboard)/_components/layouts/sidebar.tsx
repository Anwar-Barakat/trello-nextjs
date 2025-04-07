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
import { Organization } from "@/types/organization.type"
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

    // Memoize the default accordion value calculation to avoid unnecessary recalculations
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
            <div className={cn("flex h-full w-full items-center justify-center p-4", className)}>
                <Skeleton className="h-full w-full rounded-lg bg-[var(--sidebar-accent)]" />
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