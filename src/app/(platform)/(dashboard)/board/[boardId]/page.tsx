import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"

interface BoardIdPageProps {
    params: {
        boardId: string
    }
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
    const { orgId } = await auth()

    if (!orgId) {
        redirect("/select-org")
    }

    const board = await prisma.board.findUnique({
        where: {
            id: params.boardId,
            organizationId: orgId,
        },
    })

    if (!board) {
        notFound()
    }

    console.log(board)

    return (
        <div className="relative min-h-screen bg-no-repeat bg-cover bg-center bg-fixed overflow-hidden">
        </div>
    )
}

export default BoardIdPage