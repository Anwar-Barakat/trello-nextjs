"use client";

import { useState, useRef, useEffect } from "react";
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
import type { Card } from "@prisma/client";

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
    const [cards, setCards] = useState(list.cards);
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update cards when list prop changes
    useEffect(() => {
        setCards(list.cards);
    }, [list.cards]);

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

    const handleCardCreated = (newCard: Card) => {
        // Optimistically update the UI with the new card
        setCards(prevCards => [...prevCards, newCard]);

        // We can either hide the form automatically
        // setShowCardForm(false);

        // Or keep it open to add more cards (current behavior)
        // By not hiding the form, we make it easier to add multiple cards in succession
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
                                            className="h-7 text-sm font-medium border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-input bg-white px-2.5"
                                            onBlur={disableEditing}
                                            onKeyDown={(e) => {
                                                if (e.key === "Escape") disableEditing();
                                                if (e.key === "Enter") e.currentTarget.form?.requestSubmit();
                                            }}
                                        />
                                    </form>
                                ) : (
                                    <div
                                        className="w-full text-sm px-2.5 py-1 font-medium cursor-pointer"
                                        onClick={enableEditing}
                                    >
                                        {title}
                                    </div>
                                )}

                                <div className="flex items-center gap-0.5">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={toggleCollapse}
                                    >
                                        {isCollapsed ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronUp className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" side="bottom">
                                            <DropdownMenuItem onClick={enableEditing}>
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleCopy}>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={handleDelete}
                                            >
                                                <Trash className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Status counts */}
                            {total > 0 && (
                                <div className="flex gap-2 px-2 pb-2 text-[0.65rem] text-muted-foreground">
                                    <div className="flex items-center">
                                        <span>{total} item{total === 1 ? '' : 's'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* List content */}
                        <div className={cn(
                            "flex flex-col px-1 py-0.5",
                            isCollapsed ? "h-0 overflow-hidden" : "flex-1 overflow-y-auto"
                        )}>
                            <Droppable droppableId={list.id} type="card">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="flex flex-col gap-y-2 pt-1 min-h-[1px]"
                                    >
                                        {cards.map((card, index) => (
                                            <CardItem
                                                key={card.id}
                                                index={index}
                                                card={card}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            {/* Card creation form */}
                            {showCardForm ? (
                                <div className="p-2">
                                    <CardForm
                                        listId={list.id}
                                        onClose={() => setShowCardForm(false)}
                                        onCardCreated={handleCardCreated}
                                    />
                                </div>
                            ) : (
                                <div className="px-2 pt-1.5 pb-2">
                                    <Button
                                        onClick={() => setShowCardForm(true)}
                                        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm flex items-center gap-2"
                                        size="sm"
                                        variant="ghost"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add a card</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </ListWrapper>
            )}
        </Draggable>
    );
};

export default ListItem;