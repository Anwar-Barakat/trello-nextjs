'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import useBoardStore from '../stores/board.store';
import { deleteBoard } from '../actions/delete-board';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TrashIcon } from 'lucide-react'
import type { Board } from '@/types/board.type';

interface BoardListProps {
    initialBoards: Board[];
}

const BoardList = ({ initialBoards }: BoardListProps) => {
    const router = useRouter();
    const { boards, setBoards, setIsLoading } = useBoardStore();
    const [deletingId, setDeletingId] = React.useState<string | null>(null);

    // Sync the store with the server data whenever initialBoards changes
    useEffect(() => {
        if (initialBoards && initialBoards.length > 0) {
            setBoards(initialBoards);
        }
    }, [initialBoards, setBoards]);

    const handleDeleteBoard = async (boardId: string) => {
        if (!boardId) return;

        try {
            setDeletingId(boardId);
            await deleteBoard(boardId);

            // Update local state
            setBoards(boards.filter((board) => board.id !== boardId));

            // Refresh the page to reflect the deletion
            router.refresh();
        } catch (error) {
            console.error("Error deleting board:", error);
        } finally {
            setDeletingId(null);
        }
    }

    if (!boards || boards.length === 0) {
        return (
            <div className="flex items-center justify-center p-6">
                <p className="text-muted-foreground">No boards found. Create one to get started!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Boards ({boards.length})</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {boards.map((board) => (
                    <div
                        key={board.id}
                        className="group relative rounded-lg border border-muted bg-card p-4 hover:shadow-sm transition"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{board.title}</h4>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition h-8 w-8"
                                    >
                                        <TrashIcon className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the board.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDeleteBoard(board.id as string)}
                                            disabled={deletingId === board.id}
                                        >
                                            {deletingId === board.id ? "Deleting..." : "Delete"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BoardList