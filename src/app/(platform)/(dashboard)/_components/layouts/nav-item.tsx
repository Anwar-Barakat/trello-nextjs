'use client'

import { AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Organization } from '@/types/organization.type'
import React from 'react'

type NavItemProps = {
    isActive: boolean
    isExpanded: boolean
    organization: Organization
    onExpand: (value: string[]) => void
}

const NavItem = ({ isActive, isExpanded, organization, onExpand }: NavItemProps) => {
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
        </AccordionItem>
    )
}

export default NavItem