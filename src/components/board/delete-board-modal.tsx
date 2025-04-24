'use client';

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

interface DeleteBoardModalProps {
    boardId: string;
    boardTitle: string;
    isDeleting: boolean;
    onDelete: (boardId: string) => void;
}

const DeleteBoardModal = ({
    boardId,
    boardTitle,
    isDeleting,
    onDelete
}: DeleteBoardModalProps) => {
    return (
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
                        This will permanently remove <span className="font-medium text-foreground">{boardTitle}</span> and all its content.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row justify-end gap-2">
                    <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onDelete(boardId)}
                        disabled={isDeleting}
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
    );
};

export default DeleteBoardModal;