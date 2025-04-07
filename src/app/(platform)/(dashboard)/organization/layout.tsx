import Sidebar from "../_components/layouts/sidebar"

type OrganizationLayoutProps = {
    children: React.ReactNode
}

const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
    return (
        <div className='h-full pt-20 md:pt-20 px-4 md:px-6 max-w-6xl 2xl:max-w-screen-xl mx-auto'>
            <div className='flex gap-x-7'>
                <div className="w-64 shrink-0">
                    <Sidebar />
                </div>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default OrganizationLayout
