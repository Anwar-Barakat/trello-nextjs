import { OrganizationSwitcher } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const OrganizationIdPage = async () => {
    const { userId, orgId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    return (
        <div>
            {/* <OrganizationSwitcher
                afterSelectOrganizationUrl={'/organization/:id'}
                afterCreateOrganizationUrl={'/organization/:id'}
                hidePersonal
            /> */}
        </div>
    )
}

export default OrganizationIdPage
