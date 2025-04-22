import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import BoardNavbar from "./_components/board-navbar"

type BoardIdLayoutProps = {
    children: React.ReactNode
    params: {
        boardId: string
    }
}

export const generateMetadata = async ({ params }: BoardIdLayoutProps) => {
    const { orgId } = await auth()

    if (!orgId) {
        redirect("/select-org")
    }
}

const BoardIdLayout = async ({ children, params }: BoardIdLayoutProps) => {
    const { orgId } = await auth()

    if (!orgId) {
        redirect("/select-org")
    }

    const board = await prisma.board.findUnique({
        where: {
            id: params.boardId,
            organizationId: orgId
        }
    })

    if (!board) {
        notFound()
    }

    return (
        <div className="relative min-h-screen bg-no-repeat bg-cover bg-center bg-fixed overflow-hidden"
            style={{
                backgroundImage: board.imageFullUrl ? `url(${board.imageFullUrl})` : "url('/grid.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
            }}>
            <BoardNavbar board={board} />
            <main className="relative pt-28 h-full">

            </main>
        </div>
    )
}

export default BoardIdLayout