import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import ListContainer from "./_components/list-container"
import fetchBoardList from "@/actions/list/fetch-board-list"

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
        },
    })

    if (!board) {
        notFound()
    }

    const lists = await fetchBoardList(params.boardId)

    return (
        <div className="">
            <ListContainer boardId={params.boardId} lists={lists} />
        </div>
    )
}

export default BoardIdPage