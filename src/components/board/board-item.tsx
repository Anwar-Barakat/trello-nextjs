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
import Image from 'next/image';
import { DEFAULT_UNSPLASH_IMAGE } from '@/constants/unsplash.constants';

interface BoardItemProps {
    board: Board;
    onDelete: (boardId: string) => void;
    isDeleting: boolean;
}

/**
 * Individual board item component with enhanced image display
 */
const BoardItem = ({
    board,
    onDelete,
    isDeleting
}: BoardItemProps) => {
    const imageUrl = board.imageThumbUrl || DEFAULT_UNSPLASH_IMAGE;
    const attribution = board.imageUserName ? `Photo by ${board.imageUserName}` : '';

    return (
        <div className="group relative rounded-xl overflow-hidden border bg-card hover:shadow-md transition-all duration-200">
            {/* Image section */}
            <div className="aspect-video w-full relative">
                <Image
                    src={imageUrl}
                    alt={board.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {attribution && (
                    <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                        {attribution}
                    </div>
                )}
            </div>

            {/* Content section */}
            <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold truncate">{board.title}</h3>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition h-8 w-8 -mr-2"
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
        </div>
    );
};

export default memo(BoardItem);