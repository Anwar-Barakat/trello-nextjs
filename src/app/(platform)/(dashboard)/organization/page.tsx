    import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const OrganizationPage = async () => {
  const { userId, orgId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  if (orgId) {
    redirect(`/organization/${orgId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Select an Organization</h1>
      <p className="text-muted-foreground mb-4">
        Please select an organization to continue
      </p>
    </div>
  )
}

export default OrganizationPage
