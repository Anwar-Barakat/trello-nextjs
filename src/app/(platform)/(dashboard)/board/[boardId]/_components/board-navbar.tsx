import { prisma } from "@/lib/prisma"
import type { Board } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import BoardTitleForm from "./board-title-form"

type BoardNavbarProps = {
    board: Board
}

const BoardNavbar = async ({ board }: BoardNavbarProps) => {
    
    return (
        <div className="flex items-center p-3 h-14 z-50 relative bg-background border-b shadow-sm">
            <BoardTitleForm board={board} />
        </div>
    )
}

export default BoardNavbar