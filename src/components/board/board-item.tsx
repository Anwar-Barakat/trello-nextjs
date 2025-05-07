'use client';

import React, { memo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { TrashIcon, PencilIcon } from 'lucide-react';
import type { Board } from '@/types/board.types';
import Image from 'next/image';
import { DEFAULT_UNSPLASH_IMAGE } from '@/constants/unsplash.constants';
import EditBoardModal from './edit-board-modal';
import DeleteBoardModal from './delete-board-modal';
import Link from 'next/link';

interface BoardItemProps {
    board: Board;
    onDelete: (boardId: string) => void;
    onEdit: (boardId: string, newTitle: string) => void;
    isDeleting: boolean;
    isEditing: boolean;
    organizationId: string;
}

/**
 * Modern board item component with enhanced styling and interactions
 */
const BoardItem = ({
    board,
    onDelete,
    onEdit,
    isDeleting,
    isEditing,
    organizationId
}: BoardItemProps) => {
    const imageUrl = board.imageThumbUrl || DEFAULT_UNSPLASH_IMAGE;
    const attribution = board.imageUserName ? `Photo by ${board.imageUserName}` : '';
    const [editedTitle, setEditedTitle] = useState(board.title);

    const handleEdit = (newTitle: string) => {
        if (newTitle.trim() && newTitle !== board.title) {
            onEdit(board.id, newTitle.trim());
        }
    };

    return (
        <div className="group relative rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 shadow-sm">
            {/* Enhanced image section with hover overlay */}
            <Link href={`/organization/${organizationId}/board/${board.id}`}>
                <div className="aspect-video w-full relative bg-muted/50 group-hover:brightness-90 transition-all duration-300">
                    <Image
                        src={imageUrl}
                        alt={board.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                        loading="lazy"
                        quality={75}
                    />
                    {attribution && (
                        <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[0.65rem] tracking-tight px-1.5 py-0.5 rounded-tl-md backdrop-blur-[1px]">
                            {attribution}
                        </div>
                    )}
                </div>
            </Link>

            {/* Content section with smooth interactions */}
            <div className="p-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <Link href={`/organization/${organizationId}/board/${board.id}`}>
                        <h3 className="font-medium truncate text-sm hover:text-primary transition-colors px-1">
                            {board.title}
                        </h3>
                    </Link>
                    <div className="flex gap-1">
                        <EditBoardModal
                            boardTitle={board.title}
                            isEditing={isEditing}
                            onEdit={handleEdit}
                        />
                        <DeleteBoardModal
                            boardId={board.id}
                            boardTitle={board.title}
                            isDeleting={isDeleting}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(BoardItem);