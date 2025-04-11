'use client';

import React, { memo } from 'react';
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from 'lucide-react';
import type { Board } from '@/types/board.types';

interface BoardItemProps {
    board: Board;
    onDelete: (boardId: string) => void;
    isDeleting: boolean;
}

/**
 * Individual board item component
 */
const BoardItem = ({
    board,
    onDelete,
    isDeleting
}: BoardItemProps) => {
    return (
        <div
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
                            aria-label="Delete board"
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
                                onClick={() => onDelete(board.id)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default memo(BoardItem);