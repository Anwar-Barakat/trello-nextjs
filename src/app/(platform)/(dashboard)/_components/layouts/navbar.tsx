import { Logo, MainButton } from '@/components/global'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import React from 'react'
import BoardForm from '@/components/board/board-form' // Update with the correct path

const Navbar = () => {
    return (
        <nav className='fixed top-0 left-0 w-full px-4 md:px-6 h-16 border-b shadow-sm bg-background dark:bg-[var(--background)] flex items-center z-50'>
            <div className='flex items-center gap-x-2 md:gap-x-4'>
                <div className='hidden lg:flex h-full pr-2'>
                    <Logo />
                </div>

                {/* Use BoardForm with custom trigger */}
                <BoardForm
                    trigger={
                        <>
                            {/* Desktop version */}
                            <MainButton
                                variant='ghost'
                                size='sm'
                                className='rounded-md hidden md:flex h-9 px-3 gap-1.5 transition-colors hover:bg-accent hover:text-accent-foreground'
                            >
                                <Plus className='h-4 w-4' />
                                <span className='font-medium'>Create</span>
                            </MainButton>
                            {/* Mobile version */}
                            <MainButton
                                size='icon'
                                className='rounded-md md:hidden h-9 w-9 transition-colors hover:bg-accent hover:text-accent-foreground'
                            >
                                <Plus className='h-4 w-4' />
                            </MainButton>
                        </>
                    }
                />
            </div>

            <div className='ml-auto flex items-center gap-x-2 md:gap-x-3'>
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl='/organization/:id'
                    afterLeaveOrganizationUrl='/organization/:id'
                    afterSelectOrganizationUrl={'/organization/:id'}
                    appearance={{
                        elements: {
                            rootBox: 'flex justify-center items-center w-fit',
                            organizationSwitcherTrigger: 'p-1.5 hover:bg-accent rounded-md transition-colors',
                            organizationSwitcherPopoverCard: 'mt-2 shadow-lg'
                        }
                    }}
                />

                <UserButton
                    afterSignOutUrl='/'
                    appearance={{
                        elements: {
                            avatarBox: 'w-10 h-10 rounded-full transition-transform hover:scale-105',
                            userButtonPopoverCard: 'mt-2 shadow-lg'
                        }
                    }}
                />
            </div>
        </nav>
    )
}

export default Navbar