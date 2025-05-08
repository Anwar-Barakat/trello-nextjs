'use client';

import React, { memo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BoardHeaderProps {
  totalBoards: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Board list header with search functionality
 */
const BoardHeader = ({
  totalBoards,
  searchQuery,
  setSearchQuery
}: BoardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <h3 className="text-primary font-bold text-2xl">
        Your Boards
        {totalBoards > 0 && <span className="text-muted-foreground font-normal text-base ml-2">({totalBoards})</span>}
      </h3>

      <div className="relative w-full sm:w-64">
        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search boards..."
          className="pl-9 w-full"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <title>Clear search</title>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(BoardHeader);