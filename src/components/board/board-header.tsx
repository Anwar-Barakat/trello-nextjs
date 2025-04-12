
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
      <h3 className="text-lg font-medium">
        Your Boards ({totalBoards})
      </h3>
      
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search boards..."
          className="pl-8 w-full sm:w-[200px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default memo(BoardHeader);