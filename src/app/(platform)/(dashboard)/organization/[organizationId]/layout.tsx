import OrgControl from "./_components/org-control"

type OrganizationLayoutIdProps = {
    children: React.ReactNode
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
