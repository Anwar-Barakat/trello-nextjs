type ClerkLayoutProps = {
    children: React.ReactNode
}

const ClerkLayout = ({ children }: ClerkLayoutProps) => {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            {children}
        </div>
    )
}

export default ClerkLayout