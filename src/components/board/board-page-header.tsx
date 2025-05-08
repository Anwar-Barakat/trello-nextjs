'use client';

import React, { memo } from 'react';
import { Badge } from "@/components/ui/badge";

interface BoardPageHeaderProps {
    title: string;
    availableCount: number;
}

/**
 * Header for an individual board page
 */
const BoardPageHeader = ({
    title,
    availableCount
}: BoardPageHeaderProps) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-x-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                {availableCount !== undefined && (
                    <Badge variant="secondary" className="ml-2">
                        {availableCount} board{availableCount === 1 ? '' : 's'} remaining
                    </Badge>
                )}
            </div>
        </div>
    );
};

export default memo(BoardPageHeader); 