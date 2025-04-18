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
 * Modern board item component with enhanced styling and interactions
 */
const BoardItem = ({
    board,
    onDelete,
    isDeleting
}: BoardItemProps) => {
    const imageUrl = board.imageThumbUrl || DEFAULT_UNSPLASH_IMAGE;
    const attribution = board.imageUserName ? `Photo by ${board.imageUserName}` : '';

    return (
        <div className="group relative rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 shadow-sm">
            {/* Enhanced image section with hover overlay */}
            <div className="aspect-video w-full relative bg-muted/50 group-hover:brightness-90 transition-all duration-300">
                <Image
                    src={imageUrl}
                    alt={board.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                />
                {attribution && (
                    <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[0.65rem] tracking-tight px-1.5 py-0.5 rounded-tl-md backdrop-blur-[1px]">
                        {attribution}
                    </div>
                )}
            </div>

            {/* Content section with smooth interactions */}
            <div className="p-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium truncate text-sm hover:text-primary transition-colors px-1">
                        {board.title}
                    </h3>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out h-7 w-7 -mr-1 hover:bg-destructive/10 hover:text-destructive"
                                aria-label="Delete board"
                            >
                                <TrashIcon className="h-[0.95rem] w-[0.95rem]" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[95vw] rounded-xl sm:max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-left">Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground/80">
                                    This will permanently remove <span className="font-medium text-foreground">{board.title}</span> and all its content.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row justify-end gap-2">
                                <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(board.id)}
                                    disabled={isDeleting}
                                    variant="destructive"
                                    className="rounded-lg"
                                >
                                    {isDeleting ? (
                                        <span className="flex items-center gap-1.5">
                                            <span className="animate-spin">🌀</span>
                                            Deleting...
                                        </span>
                                    ) : 'Confirm Delete'}
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