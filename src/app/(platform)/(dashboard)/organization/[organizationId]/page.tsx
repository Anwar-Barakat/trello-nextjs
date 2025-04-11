'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Board } from '@/types/board.types';
import BoardForm from '@/components/board/board-form';
import BoardList from '@/components/board/board-list';
import { listBoard } from '@/actions/board/list-board';

interface OrganizationIdPageProps {
    params: {
        organizationId: string;
    };
}

/**
 * Organization settings page
 */
const OrganizationIdPage = async ({ params }: OrganizationIdPageProps) => {
    const { userId, orgId } = await auth();

    // Authentication check
    if (!userId) {
        redirect('/sign-in');
    }

    // Fetch initial board data
    const initialBoards = await listBoard() as Board[];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        Organization Settings
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Manage your organization settings and preferences
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4">
                        <BoardForm />
                    </div>
                </CardContent>

                <Separator />

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