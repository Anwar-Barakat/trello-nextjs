'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { generateOrganizationRoutes } from '@/lib/routes'
import type { Organization } from '@/types/organization.types'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import { OrgActivities } from './org-activities'
import { Separator } from '@/components/ui/separator'

type NavItemProps = {
    isActive: boolean
    isExpanded: boolean
    organization: Organization
    onExpand: (value: string[]) => void
}

const NavItem = ({ isActive, isExpanded, organization, onExpand }: NavItemProps) => {
    const router = useRouter()
    const pathname = usePathname()

    // Get organization navigation routes
    const routes = useMemo(() => generateOrganizationRoutes(organization.id), [organization.id])

    // Find active route for visual indication
    const activeRoute = useMemo(() => {
        return routes.find(route => pathname.includes(route.href))
    }, [routes, pathname])

    // Get user's initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
    }

    return (
        <AccordionItem value={organization.id} className='border-none'>
            <AccordionTrigger
                onClick={() => onExpand([organization.id])}
                className={cn(
                    'flex items-center gap-2 p-2 text-sm font-medium hover:bg-accent/50 transition-colors group',
                    isActive && !isExpanded && 'bg-sky-500/10 text-sky-700'
                )}
            >
                <div className='flex items-center gap-2 flex-1'>
                    <Avatar className='h-5 w-5 shrink-0'>
                        <AvatarImage src={organization.imageUrl} alt={organization.name} />
                        <AvatarFallback className="text-[10px] font-semibold">
                            {getInitials(organization.name)}
                        </AvatarFallback>
                    </Avatar>
                    <p className='truncate'>{organization.name}</p>
                </div>
                {!isExpanded && activeRoute && (
                    <div className="ml-auto mr-4 h-2 w-2 rounded-full bg-sky-500" />
                )}
            </AccordionTrigger>

            <AccordionContent className='pt-1 pb-3'>
                <div className='flex flex-col space-y-1'>
                    {routes.map(route => (
                        <button
                            type="button"
                            key={route.href}
                            onClick={() => router.push(route.href)}
                            className={cn(
                                'w-full rounded-sm hover:bg-accent/50 text-muted-foreground transition-colors flex items-center pl-10 pr-3 py-1.5 text-sm',
                                pathname === route.href && 'bg-accent text-accent-foreground'
                            )}
                        >
                            <route.icon className='h-4 w-4 mr-2' />
                            <span className='truncate'>{route.label}</span>
                        </button>
                    ))}
                </div>

                {/* Separator and recent activities */}
                <Separator className="my-2 mx-3" />
                <OrgActivities organizationId={organization.id} />
            </AccordionContent>
        </AccordionItem>
    )
}

export default NavItem