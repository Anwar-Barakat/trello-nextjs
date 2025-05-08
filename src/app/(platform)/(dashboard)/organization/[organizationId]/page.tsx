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
import { getAvailableCount, hasAvailableCount } from '@/lib/org-limit';
import { checkSubscription } from '@/lib/subscription';

interface OrganizationIdPageProps {
    params: {
        organizationId: string;
    };
}

/**
 * Organization settings page
 */
const OrganizationIdPage = async (props: OrganizationIdPageProps) => {
    // Await the params to resolve dynamic params error
    const params = await Promise.resolve(props.params);
    const organizationId = params.organizationId;

    const { userId, orgId } = await auth();

    // Authentication check
    if (!userId) {
        redirect('/sign-in');
    }

    // Organization check
    if (!orgId) {
        redirect('/select-org');
    }

    // Ensure the user is accessing their current organization
    if (orgId !== organizationId) {
        // Instead of redirecting, we'll let the client-side handle the organization switch
        return null;
    }

    try {
        // Fetch initial board data
        const initialBoards = await listBoard() as Board[];
        const availableCount = await getAvailableCount();
        const hasUserAvailableCount = await hasAvailableCount(organizationId);
        const isSubscribed = await checkSubscription(organizationId);

        return (
            <div className="flex-1 space-y-4 px-16 lg:px-8 pt-24 lg:pt-6">
                <Card>
                    <BoardHead />
                    <CardContent>
                        <div className="grid gap-4">
                            <BoardForm
                                availableCount={availableCount}
                                hasAvailableCount={hasUserAvailableCount}
                                isSubscribed={isSubscribed}
                            />
                        </div>
                    </CardContent>

                    <CardContent>
                        <div className="grid gap-4">
                            <BoardList
                                initialBoards={initialBoards ?? []}
                                organizationId={organizationId}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    } catch (error) {
        console.error('Error loading organization page:', error);
        redirect('/select-org');
    }
};

export default OrganizationIdPage;