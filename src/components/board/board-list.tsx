'use client';

import React, { memo } from 'react';
import { PlusCircle } from 'lucide-react';
import { useBoard } from '@/hooks/board/useBoard';
import BoardItem from './board-item';
import EmptyState from '@/components/global/empty-state';
import BoardHeader from './board-header';
import { Skeleton } from '@/components/ui/skeleton';
import type { Board } from '@/types/board.types';

interface BoardListProps {
    initialBoards: Board[];
}

/**
 * Final board list component with all improvements
 */
const BoardList = ({ initialBoards }: BoardListProps) => {
    const {
        boards,
        allBoards,
        deletingId,
        error,
        searchQuery,
        setSearchQuery,
        handleDeleteBoard,
        handleEditBoard,
        isLoading,
        isBoardEditing
    } = useBoard({
        initialBoards
    });

    // Show loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-8 w-[200px]" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={`skeleton-${i}`} className="flex flex-col gap-2">
                            <Skeleton className="h-[100px] w-full" />
                            <Skeleton className="h-4 w-[50px]" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Show empty state when no boards exist
    if (allBoards.length === 0) {
        return (
            <EmptyState
                title="No boards found"
                description="Create your first board to get started with organizing your work."
                actionLabel="Create Board"
                actionIcon={<PlusCircle className="h-4 w-4" />}
                onAction={() => {
                    const titleInput = document.querySelector('input[name="title"]');
                    if (titleInput) {
                        (titleInput as HTMLInputElement).focus();
                    }
                }}
            />
        );
    }

    // Show "no results" state when search returns no results
    if (allBoards.length > 0 && boards.length === 0) {
        return (
            <div className="space-y-4">
                <BoardHeader
                    totalBoards={allBoards.length}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <EmptyState
                    title="No matching boards"
                    description={`No boards match your search "${searchQuery}". Try a different search term.`}
                    actionLabel="Clear Search"
                    onAction={() => setSearchQuery('')}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <BoardHeader
                totalBoards={allBoards.length}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-2 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {boards.map((board: Board) => (
                    <BoardItem
                        key={board.id}
                        board={board}
                        onDelete={handleDeleteBoard}
                        isDeleting={deletingId === board.id}
                        onEdit={handleEditBoard}
                        isEditing={isBoardEditing}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(BoardList);