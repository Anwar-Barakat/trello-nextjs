'use client';

import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon } from 'lucide-react';

interface EditBoardModalProps {
    boardTitle: string;
    isEditing: boolean;
    onEdit: (newTitle: string) => void;
}

const EditBoardModal = ({
    boardTitle,
    isEditing,
    onEdit
}: EditBoardModalProps) => {
    const [editedTitle, setEditedTitle] = useState(boardTitle);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out h-7 w-7 -mr-1 hover:bg-primary/10 hover:text-primary"
                    aria-label="Edit board title"
                >
                    <PencilIcon className="h-[0.95rem] w-[0.95rem]" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[95vw] rounded-xl sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">Edit Board Title</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <AlertDialogFooter className="flex-row justify-end gap-2">
                    <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onEdit(editedTitle)}
                        disabled={isEditing}
                        className="rounded-lg"
                    >
                        {isEditing ? (
                            <span className="flex items-center gap-1.5">
                                <span className="animate-spin">🌀</span>
                                Saving...
                            </span>
                        ) : 'Save Changes'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EditBoardModal;