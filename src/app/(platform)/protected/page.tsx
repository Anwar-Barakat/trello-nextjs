import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const ProtectedPage = async () => {
    const user = await currentUser()
    const { userId } = await auth()

    if (!user) {
        redirect('/sign-in')
    }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>{user?.fullName}</p>
      <p>{userId}</p>
    </div>
  )
}

export default ProtectedPage
