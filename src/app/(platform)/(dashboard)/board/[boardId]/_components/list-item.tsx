"use client";

import { useState, useRef } from "react";
import ListWrapper from "./list-wrapper";
import { List } from "@prisma/client";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { updateList } from "@/actions/list/update-list";
import { useParams } from "next/navigation";
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { ListWithCards } from "@/types/list-card.types";

interface ListItemProps {
    list: ListWithCards;
    index: number;
}

const ListItem = ({ list, index }: ListItemProps) => {
    const { boardId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
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
            disableEditing();
        }
    };

    const handleDelete = async () => {
        const result = await deleteList(list.id, boardId as string);
        // Toast or notification could be added here
    };

    const handleCopy = async () => {
        const result = await copyList(list.id, boardId as string);
        // Toast or notification could be added here
    };

    const toggleCardForm = () => {
        setShowCardForm((current) => !current);
    };

    return (
        <Draggable draggableId={list.id} index={index}>
            {(provided) => (
                <ListWrapper
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div
                        className="bg-[#f1f2f4] rounded-md shadow-sm pb-2 w-full"
                        {...provided.dragHandleProps}
                    >
                        {isEditing ? (
                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                className="pt-2 px-2"
                            >
                                <Input
                                    ref={inputRef}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-sm px-2 py-1 h-8 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-white"
                                    onBlur={handleSubmit as any}
                                />
                            </form>
                        ) : (
                            <div className="pt-2 px-2 flex justify-between items-center text-sm font-medium mb-2">
                                <div
                                    onClick={enableEditing}
                                    className="w-full text-sm px-2.5 py-1 h-8 font-medium border-transparent truncate cursor-pointer"
                                >
                                    {list.title}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="h-auto w-auto p-1 focus:outline-none">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" side="bottom">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={enableEditing}>Rename</DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleCopy}>Copy</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleDelete}
                                            className="text-red-600"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        <Droppable droppableId={list.id} type="card">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="px-1 mx-1 flex flex-col gap-y-2"
                                >
                                    {list.cards.map((card, index) => (
                                        <CardItem
                                            key={card.id}
                                            card={card}
                                            index={index}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

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
                    </div>
                </ListWrapper>
            )}
        </Draggable>
    );
};

export default ListItem;