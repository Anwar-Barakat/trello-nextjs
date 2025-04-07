'use client'

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import Link from "next/link"
import useSidebarStore from "../../stores/sidebar.store"
import NavItem from "./nav-item"
import { Organization } from "@/types/organization.type"

type SidebarProps = {
    storageKey: string
}

const Sidebar = ({ storageKey = 't-sidebar-state' }: SidebarProps) => {
    const { expanded, onExpandMultiple } = useSidebarStore()
    const { organization: activeOrganization, isLoaded: isOrgLoaded } = useOrganization()
    const { userMemberships, isLoaded: isOrgListLoaded } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    })
    const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc: string[], curr: string) => {
        if (expanded[curr]) {
            acc.push(curr)
        }
        return acc
    }, [])

    const onExpand = (value: string[]) => {
        onExpandMultiple(value)
    }
    if (!isOrgLoaded || !isOrgListLoaded || userMemberships.isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center p-4">
                <Skeleton className="h-full w-full rounded-lg bg-[var(--sidebar-accent)]" />
            </div>
        )
    }

    return (
        <>
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
                    </Link>
                </Button>
            </div>
            <Accordion
                type="multiple"
                defaultValue={defaultAccordionValue}
                onValueChange={onExpand}
                className="space-y-2"
            >
                {userMemberships.data?.map(({ organization }) => (
                    <NavItem
                        key={organization.id}
                        isActive={activeOrganization?.id === organization.id}
                        isExpanded={expanded[organization.id]}
                        organization={organization as Organization}
                        onExpand={onExpand}
                    />
                ))}
            </Accordion>
        </>
    )
}

export default Sidebar
