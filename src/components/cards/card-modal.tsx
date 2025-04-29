"use client";

import { useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Card } from "@prisma/client";
import { updateCard } from "@/actions/card/update-card";
import { deleteCard } from "@/actions/card/delete-card";
import { copyCard } from "@/actions/card/copy-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Copy, Trash } from "lucide-react";
import { cardUpdateSchema, type CardUpdateSchema } from "@/schemas/card.schema";
import { toast } from "sonner";

interface CardModalProps {
    card: Card & { list: { title: string; boardId: string } };
    isOpen: boolean;
    onClose: () => void;
}

const CardModal = ({ card, isOpen, onClose }: CardModalProps) => {
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm<CardUpdateSchema>({
        resolver: zodResolver(cardUpdateSchema),
        defaultValues: {
            title: card.title,
            description: card.description || "",
        },
    });

    const onSubmit = async (data: CardUpdateSchema) => {
        try {
            const result = await updateCard(card.id, data, card.list.boardId);

            if (result.success) {
                toast.success("Card updated successfully");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to update card");
        }
    };

    const handleCopy = async () => {
        try {
            const result = await copyCard(card.id, card.list.boardId);

            if (result.success) {
                toast.success("Card copied successfully");
                onClose();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to copy card");
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const result = await deleteCard(card.id, card.list.boardId);

            if (result.success) {
                toast.success("Card deleted successfully");
                onClose();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to delete card");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex justify-between items-center">
                        <span>Card Details</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            ref={titleRef}
                                            placeholder="Enter card title"
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Add a more detailed description..."
                                            className="min-h-24 w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="text-xs text-muted-foreground">
                            <p>In list: <span className="font-medium">{card.list.title}</span></p>
                        </div>

                        <DialogFooter className="flex justify-between">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopy}
                                >
                                    <Copy className="h-4 w-4 mr-1" />
                                    Copy
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    <Trash className="h-4 w-4 mr-1" />
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CardModal;