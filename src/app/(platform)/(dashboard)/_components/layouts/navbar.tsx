import { Logo } from '@/components/global'
import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import React from 'react'

const Navbar = () => {
    return (
        <nav className='fixed top-0 left-0 w-full px-4 h-14 border-b shadow-sm bg-white flex items-center'>
            <div className='flex items-center gap-x-4'>
                <div className='hidden md:flex h-full'>
                    <Logo />
                </div>

                <Button size='sm' className='rounded-sm hidden md:flex h-auto py-1.5 px-2 '>
                    Create
                </Button>
                <Button className='rounded block md:hidden' >
                    <Plus className='h-4 w-4' />
                </Button>
            </div>

            <div className='ml-auto flex items-center  gap-x-2'>
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl='/organization/:id'
                    afterLeaveOrganizationUrl='/organization/:id'
                    afterSelectOrganizationUrl={'/organization/:id'}
                    appearance={{
                        elements: {
                            rootBox: {
                                width: 'fit-content',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        },
                    }}
                />

                <UserButton
                    afterSignOutUrl='/'
                    appearance={{
                        elements: {
                            avatarBox: {
                                width: '30px',
                                height: '30px',
                            },
                        },
                    }}
                />
            </div>
        </nav>
    )
}

export default Navbar
