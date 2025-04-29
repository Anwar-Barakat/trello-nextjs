"use client";

import type { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlignLeft } from "lucide-react";

interface CardItemProps {
    card: Card;
    index: number;
}

const CardItem = ({ card, index }: CardItemProps) => {
    const router = useRouter();

    // Handle card click to navigate to card detail view
    const handleClick = () => {
        router.push(`/board/${card.list.board.id}/card/${card.id}`);
    };

    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={handleClick}
                    className="bg-white rounded-md shadow-sm hover:shadow-md transition p-3 cursor-pointer truncate"
                >
                    <div className="flex items-start gap-x-2">
                        <div className="w-full">
                            <p className="text-sm font-medium truncate">{card.title}</p>
                            {card.description && (
                                <div className="flex items-center gap-x-1 mt-2 text-xs text-muted-foreground">
                                    <AlignLeft className="h-3 w-3" />
                                    <span>Description</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default CardItem;