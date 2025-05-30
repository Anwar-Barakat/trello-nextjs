'use client'

import { useOrganizationList } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useEffect } from "react"

const OrgControl = () => {
    const params = useParams()
    const { setActive } = useOrganizationList()

    useEffect(() => {
        if (!setActive) return
        setActive({ organization: params.organizationId as string })
    }, [params.organizationId, setActive])

    return (
        <div>

        </div>
    )
}

export default OrgControl
