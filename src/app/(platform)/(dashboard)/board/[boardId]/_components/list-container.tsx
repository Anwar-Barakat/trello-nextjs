"use client";

import { useCallback, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { ListWithCards } from "@/types/list-card.types";
import ListForm from "./list-form";
import { reorderList } from "@/actions/list/reorder-list";
import { reorderCard } from "@/actions/card/reorder-card";
import { moveCard } from "@/actions/card/move-card";
import { toast } from "sonner";
import ListItem from "./list-item";

interface ListContainerProps {
    boardId: string;
    lists: ListWithCards[];
}

const ListContainer = ({ boardId, lists: initialLists }: ListContainerProps) => {
    const [lists, setLists] = useState<ListWithCards[]>(initialLists);

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
            } else {
                // Moving between lists
                await moveCard({
                    cardId: movedCard.id,
                    sourceListId,
                    targetListId: destListId,
                    newOrder: destination.index + 1,
                });
            }
        } catch (error) {
            // Revert the optimistic update if there's an error
            setLists(initialLists);
            toast.error("Failed to move card. Please try again.");
        }
    }, [lists, boardId, initialLists]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex gap-x-3 h-full items-start"
                    >
                        {lists.map((list, index) => (
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
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default ListContainer;