'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { generateOrganizationRoutes } from '@/lib/routes'
import { Organization } from '@/types/organization.types'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type NavItemProps = {
    isActive: boolean
    isExpanded: boolean
    organization: Organization
    onExpand: (value: string[]) => void
}

const NavItem = ({ isActive, isExpanded, organization, onExpand }: NavItemProps) => {
    const router = useRouter()
    const pathname = usePathname()

    // Memoize routes to prevent unnecessary recalculations
    const routes = useMemo(() =>
        generateOrganizationRoutes(organization.id),
        [organization.id]
    )

    const handleClick = (href: string) => {
        router.push(href)
    }

    // Get organization initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    // Get active route
    const activeRoute = useMemo(() =>
        routes?.find(route => pathname === route.href),
        [routes, pathname]
    )

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

            <AccordionContent className="pt-1 text-neutral-700 overflow-hidden">
                <div className="space-y-1">
                    {routes?.map((route) => {
                        const Icon = route.icon;
                        const isRouteActive = pathname === route.href;

                        return (
                            <TooltipProvider key={route.href} delayDuration={300}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type='button'
                                            onClick={() => handleClick(route.href)}
                                            className={cn(
                                                "flex w-full items-center gap-x-2 rounded-md p-2 text-sm font-medium hover:bg-accent/50 transition-colors",
                                                isRouteActive && "bg-sky-500/10 text-sky-700"
                                            )}
                                            aria-current={isRouteActive ? 'page' : undefined}
                                        >
                                            <Icon className="size-4 shrink-0" />
                                            <span className="truncate">{route.label}</span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center">
                                        {route.label}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default NavItem