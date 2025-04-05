import { Medal } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn, headerFont } from '@/lib/utils'



const MarketingPage = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center justify-center'>
        <div className={cn("mb-4 flex items-center gap-2 shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase text-sm font-medium")}>
          <Medal className='h-6 w-6' />
          No 1 task management
        </div>
        <h1 className={cn(headerFont.className, "mb-6 text-3xl font-bold md:text-6xl text-center text-neutral-800")}>
          Taskify helps team move
        </h1>
        <div className='capitalize text-3xl md:text-6xl text-center bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-2 w-fit text-white rounded-md'>
          work forward.
        </div>
      </div>
      <div className={cn(headerFont.className, "flex items-center justify-center text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl mx-auto text-center capitalize")}>
        Collaborate, manage projects, and reach new productivity peaks. From
        boards to kanban to timelines, we&apos;ve got you covered.
      </div>
      <div className='flex items-center justify-center mt-6'>
        <Button>
          <Link href='/sign-up'>
            Get Taskify for free
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default MarketingPage
