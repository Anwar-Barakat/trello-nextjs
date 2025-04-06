import Navbar from "./_components/layouts/navbar"

type OrganizationLayoutProps = {
    children: React.ReactNode
}

const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
    return (
        <div className="h-full">
            <Navbar />
            <main className="h-full pt-20">{children}</main>
        </div>
    )
}

export default OrganizationLayout
