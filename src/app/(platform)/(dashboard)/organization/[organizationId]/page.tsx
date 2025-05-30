'use server';

import React from 'react'

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Board } from '@/types/board.types';
import BoardForm from '@/components/board/board-form';
import BoardList from '@/components/board/board-list';
import { listBoard } from '@/actions/board/list-board';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import BoardHead from '@/components/board/board-head';
import { getAvailableCount } from '@/lib/org-limit';

interface OrganizationIdPageProps {
    params: {
        organizationId: string;
    };
}

/**
 * Organization settings page
 */
const OrganizationIdPage = async ({ params }: OrganizationIdPageProps) => {
    const { userId } = await auth();
    // Authentication check
    if (!userId) {
        redirect('/sign-in');
    }

    // Fetch initial board data
    const initialBoards = await listBoard() as Board[];
    const availableCount = await getAvailableCount();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Card>
                <BoardHead />
                <CardContent>
                    <div className="grid gap-4">
                        <BoardForm availableCount={availableCount} />
                    </div>
                </CardContent>


                <CardContent>
                    <div className="grid gap-4">
                        <BoardList initialBoards={initialBoards ?? []} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrganizationIdPage;