'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Board } from '@/types/board.types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { deleteBoard } from '@/actions/board/delete-board';
import { toast } from 'sonner';
import { DEFAULT_UNSPLASH_IMAGE } from '@/constants/unsplash.constants';

interface BoardCardProps {
    board: Board;
    onDelete?: (boardId: string) => void;
}

const BoardCard = ({ board, onDelete }: BoardCardProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const result = await deleteBoard(board.id);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success('Board deleted');
            if (onDelete) {
                onDelete(board.id);
            }
            router.refresh();
        } catch (error) {
            toast.error('Failed to delete board');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Use board image if available, otherwise use default
    const imageUrl = board.imageThumbUrl || DEFAULT_UNSPLASH_IMAGE;

    // Image attribution - only show if we have a custom image
    const attribution = board.imageUserName && board.imageThumbUrl ? `Photo by ${board.imageUserName}` : '';

    return (
        <div className="group relative rounded-xl overflow-hidden border hover:shadow-md transition-all duration-200">
            <Link href={`/board/${board.id}`} className="block h-full">
                <div className="aspect-video w-full relative">
                    <Image
                        src={imageUrl}
                        alt={board.title}
                        className="object-cover"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {attribution && (
                        <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-1 py-0.5">
                            {attribution}
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <h3 className="font-semibold truncate">{board.title}</h3>
                </div>
            </Link>

            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 bg-white/80 rounded-full hover:bg-white">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
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
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default BoardCard;