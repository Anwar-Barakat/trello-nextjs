import React from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

interface BoardIdLayoutProps {
    children: React.ReactNode;
    params: { boardId: string };
}

const BoardIdLayout = async ({ children, params }: BoardIdLayoutProps) => {
    const { orgId } = await auth();
    if (!orgId) {
        redirect("/select-org");
    }

    const board = await prisma.board.findUnique({
        where: { id: params.boardId },
    });
    if (!board) {
        notFound();
    }

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <div className="flex flex-col items-center justify-center pt-28">
                {children}
            </div>
        </div>
    );
};

export default BoardIdLayout;