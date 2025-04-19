import { auth } from "@clerk/nextjs/server"
import OrgControl from "./_components/org-control"
import { startCase } from "lodash"

type OrganizationLayoutIdProps = {
    children: React.ReactNode
}

export async function generateMetadata() {
    const { orgSlug } = await auth()

    return {
        title: startCase(orgSlug ?? "Organization"),
    }
}

const OrganizationLayoutId = ({ children }: OrganizationLayoutIdProps) => {
    return (
        <>
            <OrgControl />
            {children}
        </>
    )
}

export default OrganizationLayoutId
