'use client'

import React, { useState } from 'react'
import { Logo, MainButton } from '@/components/global'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className='fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm w-full h-14 px-4 border-b shadow-sm flex items-center justify-between'>
            <div className='max-w-screen-2xl mx-auto flex items-center justify-between w-full px-4 lg:px-8'>
                <Logo />

                {/* Desktop Navigation */}
                <div className='hidden lg:flex items-center gap-4'>
                    <MainButton href='/sign-in' variant='ghost'>Login</MainButton>
                    <MainButton href='/sign-up'>Get Taskify Free</MainButton>
                </div>

                {/* Mobile Menu Toggle */}
                <Button
                    variant='ghost'
                    size='icon'
                    className='lg:hidden text-foreground hover:bg-accent/50'
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
                </Button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className='fixed top-14 inset-x-0 bg-background/95 backdrop-blur-xl lg:hidden border-t shadow-xl transition-all'>
                    <div className='container mx-auto px-4 py-4'>
                        <div className='flex flex-col space-y-3'>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='w-fit lg:w-full justify-start text-foreground hover:bg-accent rounded-md p-4 border'
                                asChild
                            >
                                <Link href='/sign-in' onClick={() => setIsOpen(false)}>Login</Link>
                            </Button>
                            <Button
                                className='w-fit lg:w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-md capitalize transition-colors p-4'
                                asChild
                            >
                                <Link href='/sign-up' onClick={() => setIsOpen(false)}>Get Taskify Free</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
