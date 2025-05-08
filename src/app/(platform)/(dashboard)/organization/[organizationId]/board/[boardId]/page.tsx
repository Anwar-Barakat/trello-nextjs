import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvailableCount } from "@/lib/org-limit";
import BoardPageHeader from "@/components/board/board-page-header";
import ListContainer from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-container";
import fetchBoardList from "@/actions/list/fetch-board-list";

interface BoardIdPageProps {
    params: {
        boardId: string;
        organizationId: string;
    };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
    const { orgId } = await auth();

    if (!orgId) {
        redirect("/select-org");
    }

    // Ensure the organization ID from the URL matches the authenticated user's organization
    if (params.organizationId !== orgId) {
        redirect(`/organization/${orgId}`);
    }

    const board = await prisma.board.findUnique({
        where: {
            id: params.boardId,
            organizationId: orgId,
        },
    });

    if (!board) {
        notFound();
    }

    const lists = await fetchBoardList(params.boardId);
    const availableCount = await getAvailableCount();

    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <BoardPageHeader title={board.title} availableCount={availableCount} />
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