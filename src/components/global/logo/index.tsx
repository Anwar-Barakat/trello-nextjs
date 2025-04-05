'use client'

import { cn, headerFont } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
    return (
        <Link href='/'>
            <div className='flex items-center gap-2 hover:opacity-75 transition flex'>
                <Image src='/images/logo.svg' alt='logo' width={30} height={30} />
                <p className={cn(headerFont.className, "text-xl text-neutral-700 pb-1 font-bold")}>Taskify</p>
            </div>
        </Link>
    )
}

export default Logo