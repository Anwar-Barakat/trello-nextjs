'use server'

import React from 'react'
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';


const BoardList = async () => {
    const { orgId } = await auth();

    if (!orgId) {
        return null;
    }

    const boards = await prisma.board.findMany()

    return (
        <div>
            {boards.map((board) => (
                <div key={board.id}>
                    {board.title}
                </div>
            ))}
        </div>
    )
}

export default BoardList
