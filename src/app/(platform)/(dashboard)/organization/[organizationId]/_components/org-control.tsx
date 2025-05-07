'use client'

import { useOrganizationList } from "@clerk/nextjs"
import { useParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const OrgControl = () => {
    const params = useParams()
    const router = useRouter()
    const pathname = usePathname()
    const { setActive } = useOrganizationList()
    const [isSwitching, setIsSwitching] = useState(false)
    const [organizationId, setOrganizationId] = useState<string>("")

    // Extract and set the organization ID from params
    useEffect(() => {
        if (params.organizationId) {
            // Handle different param types (string or string[])
            const orgId = Array.isArray(params.organizationId)
                ? params.organizationId[0]
                : params.organizationId

            setOrganizationId(orgId)
        }
    }, [params])

    // Handle organization switching
    useEffect(() => {
        if (!setActive || !organizationId) return

        const switchOrg = async () => {
            try {
                setIsSwitching(true)
                await setActive({ organization: organizationId })

                // Only refresh if we're on the organization page
                if (pathname.startsWith('/organization/')) {
                    router.refresh()
                }
            } catch (error) {
                console.error('Error switching organization:', error)
                // If there's an error, redirect to the organization selection page
                router.push('/select-org')
            } finally {
                setIsSwitching(false)
            }
        }

        switchOrg()
    }, [organizationId, setActive, router, pathname])

    return null
}

export default OrgControl
