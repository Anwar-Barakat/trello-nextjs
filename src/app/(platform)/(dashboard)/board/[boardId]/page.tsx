import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import ListContainer from "./_components/list-container";
import fetchBoardList from "@/actions/list/fetch-board-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BoardHeader from "@/components/board/board-header";
import useBoardStore from "@/stores/board.store";
import { getAvailableCount } from "@/lib/org-limit";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
    const { orgId } = await auth();
    const { setAvailableCount, setHasAvailableCount } = useBoardStore();

    if (!orgId) {
        redirect("/select-org");
    }

    const board = await prisma.board.findUnique({
        where: {
            id: params.boardId,
            organizationId: orgId,
        },
    });

    setAvailableCount(
        await getAvailableCount()
    )

    if (!board) {
        notFound();
    }

    const lists = await fetchBoardList(params.boardId);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <h1 className="text-2xl font-bold">{board.title}</h1>
            </div>
            <div className="flex-1 overflow-hidden">
                <Suspense
                    fallback={
                        <div className="p-4 flex items-start gap-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="shrink-0 h-full w-[272px]">
                                    <Skeleton className="w-full h-20 rounded-md mb-3" />
                                    <div className="space-y-3">
                                        <Skeleton className="w-full h-16 rounded-md" />
                                        <Skeleton className="w-full h-16 rounded-md" />
                                        <Skeleton className="w-full h-16 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                >
                    <ListContainer boardId={params.boardId} lists={lists} />
                </Suspense>
            </div>
        </div>
    );
};

export default BoardIdPage;