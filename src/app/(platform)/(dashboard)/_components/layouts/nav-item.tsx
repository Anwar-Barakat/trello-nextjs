'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { generateOrganizationRoutes } from '@/lib/routes'
import { Organization } from '@/types/organization.type'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

type NavItemProps = {
    isActive: boolean
    isExpanded: boolean
    organization: Organization
    onExpand: (value: string[]) => void
}

const NavItem = ({ isActive, isExpanded, organization, onExpand }: NavItemProps) => {
    const router = useRouter()
    const pathname = usePathname()

    const routes = generateOrganizationRoutes(organization.id)

    const handleClick = (href: string) => {
        router.push(href)
    }

    return (
        <AccordionItem value={organization.id} className='border-none'>
            <AccordionTrigger
                onClick={() => onExpand([organization.id])}
                className={cn(
                    'flex items-center gap-2 p-2 text-sm font-medium hover:bg-accent/50 transition-colors',
                    isActive && !isExpanded && 'bg-sky-500/10 text-sky-700'
                )}
            >
                <div className='flex items-center gap-2'>
                    <Avatar className='h-5 w-5'>
                        <AvatarImage src={organization.imageUrl} />
                    </Avatar>
                    <p className='truncate'>{organization.name}</p>
                </div>
            </AccordionTrigger>

            {isExpanded && (
                <AccordionContent className="pt-1 text-neutral-700">
                    {routes.map((route) => {
                        const Icon = route.icon;

                        return (
                            <button
                                key={route.href}
                                type='button'
                                onClick={() => handleClick(route.href)}
                                className={cn(
                                    "flex w-full items-center gap-x-2 rounded-md p-2 text-sm font-medium hover:bg-accent/50 transition-colors",
                                    pathname === route.href && "bg-sky-500/10 text-sky-700"
                                )}
                            >
                                <Icon className="size-4" />
                                {route.label}
                            </button>
                        );
                    })}
                </AccordionContent>
            )}
        </AccordionItem>
    )
}

export default NavItem