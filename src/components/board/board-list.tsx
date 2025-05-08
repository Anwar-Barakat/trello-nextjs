'use client';

import React, { memo } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { useBoard } from '@/hooks/board/useBoard';
import BoardItem from './board-item';
import EmptyState from '@/components/global/empty-state';
import BoardHeader from './board-header';
import { Skeleton } from '@/components/ui/skeleton';
import type { Board } from '@/types/board.types';
import { useRouter } from 'next/navigation';

interface BoardListProps {
    initialBoards: Board[];
    organizationId: string;
}

/**
 * Modern skeleton component for board items
 */
const BoardSkeleton = () => {
    return (
        <div className="group relative rounded-xl overflow-hidden border bg-card shadow-sm h-[calc(100%-2px)]">
            {/* Image skeleton */}
            <div className="aspect-video w-full relative bg-muted/50">
                <Skeleton className="h-full w-full absolute" />
            </div>

            {/* Content section skeleton */}
            <div className="p-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-5 w-[70%]" />
                    <div className="flex gap-1">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Board header skeleton
 */
const BoardHeaderSkeleton = () => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center gap-2 relative w-full sm:w-64">
                <Skeleton className="h-10 w-full rounded-md" />
                <Search className="h-4 w-4 absolute right-3 top-3 text-muted-foreground opacity-50" />
            </div>
        </div>
    );
};

const BoardList = ({ initialBoards, organizationId }: BoardListProps) => {
    const router = useRouter();
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
        initialBoards,
        organizationId
    });

    // Show loading state
    if (isLoading) {
        // Create skeleton items with unique keys
        const skeletonItems = Array.from({ length: 6 }).map((_, index) => ({
            id: `skeleton-${Date.now()}-${index}`,
        }));

        return (
            <div className="space-y-6">
                <BoardHeaderSkeleton />
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {skeletonItems.map((item) => (
                        <BoardSkeleton key={item.id} />
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
                        organizationId={organizationId}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(BoardList);