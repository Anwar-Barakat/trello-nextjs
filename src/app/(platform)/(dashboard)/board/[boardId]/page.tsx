import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import ListContainer from "./_components/list-container";
import fetchBoardList from "@/actions/list/fetch-board-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvailableCount } from "@/lib/org-limit";
import BoardPageHeader from "@/components/board/board-page-header";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
    const { orgId } = await auth();

    if (!orgId) {
        redirect("/select-org");
    }

    // Redirecting to the new URL structure
    redirect(`/organization/${orgId}/board/${params.boardId}`);
};

export default BoardIdPage;