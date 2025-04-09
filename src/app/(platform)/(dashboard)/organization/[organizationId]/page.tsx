'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import BoardForm from './_components/board-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import BoardList from './_components/board-list'

const OrganizationIdPage = async () => {
    const { userId, orgId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold tracking-tight">Organization Settings</CardTitle>
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
                        <BoardList />
                    </div>
                </CardContent>

            </Card>
        </div>
    )
}

export default OrganizationIdPage
