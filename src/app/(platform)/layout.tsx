import { ClerkProvider } from "@clerk/nextjs"
import { Providers } from "@/app/providers"

type PlatformLayoutProps = {
    children: React.ReactNode
}

const PlatformLayout = ({ children }: PlatformLayoutProps) => {
    return (
        <ClerkProvider>
            <Providers>
                {children}
            </Providers>
        </ClerkProvider>
    )
}

export default PlatformLayout