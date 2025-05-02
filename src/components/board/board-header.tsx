
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
      </h3>
    </div>
  );
};

export default memo(BoardHeader);