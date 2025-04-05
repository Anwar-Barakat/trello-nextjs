import React from 'react'
import { Logo } from '@/components/global'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className='fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm w-full h-14 px-4 border-t shadow-sm'>
            <div className='max-w-screen-2xl mx-auto flex items-center justify-between h-full px-4 lg:px-8'>
                <div className='flex items-center gap-4'>
                    <Logo />
                    <span className='text-sm text-muted-foreground hidden md:block'>
                        Simple task management for modern teams
                    </span>
                </div>
                
                <div className='flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground'>
                    <div className='text-center'>
                        &copy; {new Date().getFullYear()} Taskify. All rights reserved.
                    </div>
                    <div className='flex gap-4'>
                        <Link href='/privacy' className='hover:text-primary transition-colors'>
                            Privacy Policy
                        </Link>
                        <Link href='/terms' className='hover:text-primary transition-colors'>
                            Terms of Service
                        </Link>
                        <Link href='/contact' className='hover:text-primary transition-colors'>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
