"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { ListWithCards } from "@/types/list-card.types";
import ListForm from "./list-form";
import { reorderList } from "@/actions/list/reorder-list";
import { reorderCard } from "@/actions/card/reorder-card";
import { moveCard } from "@/actions/card/move-card";
import { toast } from "sonner";
import ListItem from "./list-item";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Users,
    SortAsc,
    LayoutGrid,
    Settings,
    RefreshCw,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ListContainerProps {
    boardId: string;
    lists: ListWithCards[];
}

const ListContainer = ({ boardId, lists: initialLists }: ListContainerProps) => {
    const router = useRouter();
    const [lists, setLists] = useState<ListWithCards[]>(initialLists);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCompactView, setIsCompactView] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Update lists when initialLists changes (from server)
    useEffect(() => {
        setLists(initialLists);
    }, [initialLists]);

    // Function to add a new list directly to the UI state
    const handleListCreated = useCallback((newList: ListWithCards) => {
        setLists(prevLists => [...prevLists, newList]);
    }, []);

    // Set up keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + F for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                setIsSearchActive(true);
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 100);
            }

            // Escape to close search
            if (e.key === 'Escape' && isSearchActive) {
                setIsSearchActive(false);
                setSearchQuery("");
            }

            // Ctrl/Cmd + R to refresh
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                handleRefresh();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchActive]);

    // Filter lists based on search query
    const filteredLists = lists.map(list => ({
        ...list,
        cards: list.cards.filter(card => {
            if (!searchQuery) return true;

            const query = searchQuery.toLowerCase();
            return (
                card.title.toLowerCase().includes(query) ||
                (card.description && card.description.toLowerCase().includes(query))
            );
        })
    }));

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate a refresh delay
        setTimeout(() => {
            router.refresh();
            setIsRefreshing(false);
        }, 600);
    };

    const toggleCompactView = () => {
        setIsCompactView(prev => !prev);
    };

    const onDragEnd = useCallback(async (result: DropResult) => {
        const { destination, source, type } = result;

        // If dropped outside droppable area
        if (!destination) {
            return;
        }

        // If dropped in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // If reordering lists
        if (type === "list") {
            // Optimistically update UI first
            const newLists = [...lists];
            const movedList = newLists.splice(source.index, 1)[0];
            newLists.splice(destination.index, 0, movedList);

            // Update the local state
            setLists(newLists);

            // Send the update to the server
            try {
                await reorderList({
                    boardId,
                    listId: result.draggableId,
                    newOrder: destination.index + 1,
                });

                toast.success(`Moved list "${movedList.title}"`, {
                    description: `List reordered successfully`,
                    duration: 2000,
                });
            } catch (error) {
                // Revert the optimistic update if there's an error
                setLists(initialLists);
                toast.error("Failed to reorder list. Please try again.");
            }
            return;
        }

        // If moving cards between lists or reordering within a list
        const sourceListId = source.droppableId;
        const destListId = destination.droppableId;

        // Find source and destination lists
        const sourceListIndex = lists.findIndex(list => list.id === sourceListId);
        const destListIndex = lists.findIndex(list => list.id === destListId);

        if (sourceListIndex === -1 || destListIndex === -1) {
            return;
        }

        const newLists = [...lists];
        const sourceList = { ...newLists[sourceListIndex] };
        const destList = sourceListId === destListId
            ? sourceList
            : { ...newLists[destListIndex] };

        // Create copies of the cards arrays
        const sourceCards = [...sourceList.cards];
        const destCards = sourceListId === destListId
            ? sourceCards
            : [...destList.cards];

        // Get the card being moved
        const [movedCard] = sourceCards.splice(source.index, 1);

        // Insert the card at the destination
        destCards.splice(destination.index, 0, movedCard);

        // Update the lists with new card arrays
        sourceList.cards = sourceCards;
        destList.cards = destCards;

        // Update lists in state
        newLists[sourceListIndex] = sourceList;
        if (sourceListId !== destListId) {
            newLists[destListIndex] = destList;
        }

        // Update the local state optimistically
        setLists(newLists);

        // Send the update to the server
        try {
            if (sourceListId === destListId) {
                // Reordering within the same list
                await reorderCard({
                    cardId: movedCard.id,
                    listId: sourceListId,
                    newOrder: destination.index + 1,
                });

                toast.success(`Updated card position`, {
                    description: `Card reordered within ${sourceList.title}`,
                    duration: 2000,
                });
            } else {
                // Moving between lists
                await moveCard({
                    cardId: movedCard.id,
                    sourceListId,
                    targetListId: destListId,
                    newOrder: destination.index + 1,
                });

                toast.success(`Moved card to ${destList.title}`, {
                    description: `Card moved from ${sourceList.title}`,
                    duration: 2000,
                });
            }
        } catch (error) {
            // Revert the optimistic update if there's an error
            setLists(initialLists);
            toast.error("Failed to move card. Please try again.");
        }
    }, [lists, boardId, initialLists]);

    // Scroll horizontally with mouse wheel while holding shift
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            // If shift key is held or this is a trackpad horizontal scroll
            if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                container.scrollLeft += e.deltaY || e.deltaX;
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* Search and filter bar */}
            <div className={cn(
                "flex items-center gap-2 px-4 mb-2 transition-all duration-300",
                isSearchActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden mb-0"
            )}>
                {isSearchActive && (
                    <Input
                        ref={searchInputRef}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search cards..."
                        className="h-8 text-sm"
                    />
                )}
            </div>

            {/* Toolbar */}
            <div className="px-4 flex justify-between items-center mb-3">
                {/* Search button */}
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-sm"
                        onClick={() => {
                            setIsSearchActive(!isSearchActive);
                            if (!isSearchActive) {
                                setTimeout(() => searchInputRef.current?.focus(), 100);
                            } else {
                                setSearchQuery("");
                            }
                        }}
                    >
                        <Search className="w-3.5 h-3.5 mr-1.5" />
                        {isSearchActive ? "Clear search" : "Search"}
                    </Button>

                    {/* Refresh button */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isRefreshing && "animate-spin")} />
                        Refresh
                    </Button>
                </div>

                {/* View options */}
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-sm"
                        onClick={toggleCompactView}
                    >
                        <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
                        {isCompactView ? "Expanded view" : "Compact view"}
                    </Button>
                </div>
            </div>

            {/* Lists area */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="lists" type="list" direction="horizontal">
                    {(provided) => (
                        <div
                            className="flex-1 overflow-x-auto pb-2"
                            ref={(element) => {
                                provided.innerRef(element);
                                if (scrollContainerRef.current !== element) {
                                    scrollContainerRef.current = element;
                                }
                            }}
                            {...provided.droppableProps}
                        >
                            <div className="flex gap-3 h-full items-start px-4">
                                {filteredLists.map((list, index) => (
                                    <ListItem
                                        key={list.id}
                                        list={list}
                                        index={index}
                                    />
                                ))}
                                {provided.placeholder}
                                <ListForm onListCreated={handleListCreated} />
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default ListContainer;