"use client";

import { useState, useRef } from "react";
import ListWrapper from "./list-wrapper";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import {
    MoreHorizontal,
    Plus,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    Filter,
    ChevronDown,
    ChevronUp,
    Edit2,
    Trash,
    Copy,
    Archive,
    MoveVertical,
    SortAsc,
    Users
} from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { updateList } from "@/actions/list/update-list";
import { useParams, useRouter } from "next/navigation";
import { deleteList } from "@/actions/list/delete-list";
import { copyList } from "@/actions/list/copy-list";
import CardItem from "@/components/cards/card-item";
import CardForm from "@/components/cards/card-form";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ListWithCards } from "@/types/list-card.types";

interface ListItemProps {
    list: ListWithCards;
    index: number;
}

const ListItem = ({ list, index }: ListItemProps) => {
    const router = useRouter();
    const { boardId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [title, setTitle] = useState(list.title);
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    // Close when Escape is pressed globally
    useEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") disableEditing();
    });

    // Close on click outside of the form
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (title === list.title) {
            disableEditing();
            return;
        }

        const result = await updateList(list.id, { title }, boardId as string);
        if (result.success) {
            toast.success(`List renamed to "${title}"`);
            disableEditing();
        } else {
            toast.error("Failed to rename list");
        }
    };

    const handleDelete = async () => {
        const result = await deleteList(list.id, boardId as string);
        if (result.success) {
            toast.success(`List "${list.title}" deleted`);
            router.refresh();
        } else {
            toast.error("Failed to delete list");
        }
    };

    const handleCopy = async () => {
        const result = await copyList(list.id, boardId as string);
        if (result.success) {
            toast.success(`List "${list.title}" copied`);
            router.refresh();
        } else {
            toast.error("Failed to copy list");
        }
    };

    const toggleCardForm = () => {
        setShowCardForm((current) => !current);
    };

    const toggleCollapse = () => {
        setIsCollapsed((current) => !current);
    };

    // Count cards dynamically based on their actual properties in the database
    // This avoids hardcoding assumptions about status in the UI
    const getStatusCounts = () => {
        const total = list.cards.length;

        // In a real implementation, cards would have properties like:
        // status, priority, etc. directly in the database
        // Since we don't have those fields yet, we'll just count the total
        // and not try to infer status from title

        return {
            total,
            // Only include these counts if we have actual card metadata:
            doneCount: 0,
            urgentCount: 0
        };
    };

    const { total } = getStatusCounts();

    // In a real implementation, list would have a 'type' or 'status' field 
    // that would determine its color directly from the database
    const getColumnHeaderColor = () => {
        // Default style for all lists for now
        return 'bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-300';
    };

    return (
        <Draggable draggableId={list.id} index={index}>
            {(provided) => (
                <ListWrapper
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div
                        className={cn(
                            "bg-[#f1f2f4] rounded-md shadow-sm pb-2 w-full max-h-[calc(100vh-12rem)]",
                            isCollapsed ? "max-h-auto" : "flex flex-col"
                        )}
                    >
                        {/* List header */}
                        <div
                            className={cn(
                                "sticky top-0 rounded-t-md z-30",
                                getColumnHeaderColor()
                            )}
                            {...provided.dragHandleProps}
                        >
                            {/* Title and actions row */}
                            <div className="pt-2 px-2 flex justify-between items-center text-sm font-medium">
                                {isEditing ? (
                                    <form
                                        ref={formRef}
                                        onSubmit={handleSubmit}
                                        className="flex-1"
                                    >
                                        <Input
                                            ref={inputRef}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="text-sm px-2 py-1 h-8 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-white"
                                            onBlur={(e) => handleSubmit(e as any)}
                                        />
                                    </form>
                                ) : (
                                    <div className="flex items-center gap-x-2 flex-1">
                                        <div
                                            onClick={enableEditing}
                                            className="w-full text-sm px-2.5 py-1 h-8 font-medium border-transparent truncate cursor-pointer"
                                        >
                                            {list.title}
                                        </div>

                                        <div className="flex items-center gap-x-1">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={toggleCollapse}
                                                        >
                                                            {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {isCollapsed ? "Expand list" : "Collapse list"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="h-auto w-auto p-1 focus:outline-none">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" side="bottom" className="w-60">
                                                    <DropdownMenuLabel>List Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem onClick={enableEditing}>
                                                            <Edit2 className="h-4 w-4 mr-2" />
                                                            Rename
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={handleCopy}>
                                                            <Copy className="h-4 w-4 mr-2" />
                                                            Copy List
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>

                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuGroup>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>
                                                                <Filter className="h-4 w-4 mr-2" />
                                                                Filter Cards
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem>
                                                                        <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                                                                        High Priority
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                                                        Completed
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <Users className="h-4 w-4 mr-2" />
                                                                        Assigned to me
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>

                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>
                                                                <SortAsc className="h-4 w-4 mr-2" />
                                                                Sort Cards
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem>
                                                                        <Clock className="h-4 w-4 mr-2" />
                                                                        Date Created
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <AlertCircle className="h-4 w-4 mr-2" />
                                                                        Priority
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <MoveVertical className="h-4 w-4 mr-2" />
                                                                        Manual Order
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                    </DropdownMenuGroup>

                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuItem
                                                        onClick={handleDelete}
                                                        className="text-red-600"
                                                    >
                                                        <Trash className="h-4 w-4 mr-2" />
                                                        Delete List
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stats row */}
                            <div className="px-2 pb-2 flex justify-between items-center text-xs text-muted-foreground">
                                <div className="flex items-center gap-x-2">
                                    <Badge variant="outline" className="h-5 bg-white">
                                        {total} {total === 1 ? "card" : "cards"}
                                    </Badge>

                                    {/* Status badges would go here when we have proper status fields in the database */}
                                </div>

                                <div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-5 w-5">
                                                    <Filter className="h-3 w-3" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Filter cards</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>

                        {/* Cards container */}
                        {!isCollapsed && (
                            <Droppable droppableId={list.id} type="card">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={cn(
                                            "px-1 mx-1 pt-1 flex flex-col gap-y-2 overflow-y-auto",
                                            snapshot.isDraggingOver && "bg-slate-100",
                                            "min-h-[0.5px]", // This allows flex to consider the content's size
                                            list.cards.length === 0 && "h-2" // Minimum height when empty
                                        )}
                                    >
                                        {list.cards.map((card, index) => (
                                            <CardItem
                                                key={card.id}
                                                card={{
                                                    ...card,
                                                    list: {
                                                        title: list.title,
                                                        boardId: boardId as string,
                                                        board: { id: boardId as string }
                                                    }
                                                }}
                                                index={index}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )}

                        {/* Add card button or form */}
                        {!isCollapsed && (
                            <>
                                {showCardForm ? (
                                    <div className="px-1 mt-2">
                                        <CardForm
                                            listId={list.id}
                                            onClose={toggleCardForm}
                                        />
                                    </div>
                                ) : (
                                    <div className="px-1 mt-2">
                                        <Button
                                            onClick={toggleCardForm}
                                            className="w-full rounded-sm py-1.5 px-2 text-sm text-muted-foreground bg-white/80 hover:bg-white/50 transition flex items-center justify-start"
                                            variant="ghost"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add a card
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </ListWrapper>
            )}
        </Draggable>
    );
};

export default ListItem;