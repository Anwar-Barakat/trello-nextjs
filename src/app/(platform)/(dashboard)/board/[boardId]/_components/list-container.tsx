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
            {/* Board Toolbar */}
            <div className="flex items-center justify-between p-3 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    {isSearchActive ? (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search cards..."
                                className="pl-9 h-9 w-64 bg-slate-50"
                                onBlur={() => {
                                    if (!searchQuery) {
                                        setIsSearchActive(false);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setIsSearchActive(false);
                                        setSearchQuery("");
                                    }
                                }}
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                                    onClick={() => {
                                        setSearchQuery("");
                                        searchInputRef.current?.focus();
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setIsSearchActive(true)}
                        >
                            <Search className="h-4 w-4" />
                            <span>Search</span>
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
                                <span className="text-xs">⌘</span>F
                            </kbd>
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Filter Cards</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" />
                                Assigned to me
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                                High Priority
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Completed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                                Advanced Filters
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={toggleCompactView}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span>{isCompactView ? "Normal View" : "Compact View"}</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={cn(
                            "h-4 w-4",
                            isRefreshing && "animate-spin"
                        )} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
                            <span className="text-xs">⌘</span>R
                        </kbd>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Board Area */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-x-auto overflow-y-hidden"
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="lists" type="list" direction="horizontal">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={cn(
                                    "flex gap-x-3 h-full py-4",
                                    snapshot.isDraggingOver && "bg-slate-50"
                                )}
                            >
                                <ol className="flex gap-x-3 h-full items-start">
                                    {filteredLists.map((list, index) => (
                                        <ListItem
                                            key={list.id}
                                            list={list}
                                            index={index}
                                        />
                                    ))}
                                    {provided.placeholder}
                                    <ListForm />
                                    <div className="flex-shrink-0 w-1">
                                        {/* This empty div helps with scrolling to the end */}
                                    </div>
                                </ol>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default ListContainer;