"use client";

import { useState } from "react";
import type { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { AlignLeft, Clock, Tag } from "lucide-react";
import CardModal from "./card-modal";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CardItemProps {
    card: Card & { list: { title: string; boardId: string; board: { id: string } } };
    index: number;
}

const CardItem = ({ card, index }: CardItemProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic badge generation based on card metadata (if exists)
    const getPriorityBadge = (card: Card) => {
        // In a real implementation, this would read from card.priority or metadata field
        // For now, we'll infer from title as a fallback
        if (!card || !card.title) return null;

        const lowerTitle = card.title.toLowerCase();

        // This should ideally come from a database field, not inferred from title
        if (lowerTitle.includes("high") || lowerTitle.includes("urgent")) {
            return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
        } else if (lowerTitle.includes("medium")) {
            return <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">Medium</Badge>;
        } else if (lowerTitle.includes("low")) {
            return <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-300">Low</Badge>;
        }
        return null;
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Extract initials for the avatar
    const getInitials = () => {
        // In a real app, you would pull this from the assigned user
        // For now we'll generate it based on card ID to simulate different assignees
        const hash = card.id.charCodeAt(0) % 26;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return letters[hash] + letters[(hash + 5) % 26];
    };

    return (
        <>
            <Draggable draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={handleOpenModal}
                        className={cn(
                            "bg-white rounded-md shadow-sm hover:shadow-md transition p-3 cursor-pointer",
                            snapshot.isDragging && "shadow-lg ring-2 ring-primary/20",
                        )}
                    >
                        <div className="flex flex-col gap-y-2">
                            {/* Priority Badge (simulation based on title) */}
                            <div className="flex justify-between items-start">
                                <div className="flex flex-wrap gap-1">
                                    {getPriorityBadge(card)}
                                    {card.title.toLowerCase().includes("bug") && (
                                        <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">Bug</Badge>
                                    )}
                                    {card.title.toLowerCase().includes("feature") && (
                                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">Feature</Badge>
                                    )}
                                </div>
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Card Title */}
                            <p className="text-sm font-medium">{card.title}</p>

                            {/* Card Description Indicator */}
                            {card.description && (
                                <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
                                    <AlignLeft className="h-3 w-3" />
                                    <span className="truncate">{card.description.length > 25 ? `${card.description.substring(0, 25)}...` : card.description}</span>
                                </div>
                            )}

                            {/* Card Footer Metadata */}
                            <div className="flex justify-between items-center pt-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-x-1">
                                    <Tag className="h-3 w-3" />
                                    <span>#{card.id.substring(0, 5)}</span>
                                </div>
                                <div className="flex items-center gap-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        {new Date(card.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>

            <CardModal
                card={card}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default CardItem;