"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    X,
    Copy,
    Trash,
    AlignLeft,
    Clock,
    Tag,
    Loader2,
    Users,
    CheckCircle2,
    Calendar,
    BarChart2,
    Link,
    History
} from "lucide-react";
import { cardUpdateSchema, type CardUpdateSchema } from "@/schemas/card.schema";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CardModalProps {
    card: Card & { list: { title: string; boardId: string; board: { id: string } } };
    isOpen: boolean;
    onClose: () => void;
}

const CardModal = ({ card, isOpen, onClose }: CardModalProps) => {
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    const form = useForm<CardUpdateSchema>({
        resolver: zodResolver(cardUpdateSchema),
        defaultValues: {
            title: card.title,
            description: card.description || "",
            // Add any additional fields here
        },
    });

    const onSubmit = async (data: CardUpdateSchema) => {
        try {
            setIsSaving(true);
            const result = await updateCard(card.id, data, card.list.boardId);

            if (result.success) {
                toast.success("Card updated successfully");
                setIsEditing(false);
                router.refresh(); // Refresh the page to show updated data
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to update card");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopy = async () => {
        try {
            setIsCopying(true);
            const result = await copyCard(card.id, card.list.boardId);

            if (result.success) {
                toast.success("Card copied successfully");
                onClose();
                // Force a cache invalidation and refresh
                router.refresh();
            } else {
                toast.error(result.message || "Failed to copy card");
            }
        } catch (error) {
            console.error("Error copying card:", error);
            toast.error(`Failed to copy card. Please try again. ${error}`);
        } finally {
            setIsCopying(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const result = await deleteCard(card.id, card.list.boardId);

            if (result.success) {
                toast.success("Card deleted successfully");
                onClose();
                // Force a cache invalidation and refresh
                router.refresh();
            } else {
                toast.error(result.message || "Failed to delete card");
            }
        } catch (error) {
            console.error("Error deleting card:", error);
            toast.error("Failed to delete card. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Helper function to get initials for avatars
    const getInitials = (name = "User") => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Helper function to generate a random avatar image URL
    const getRandomAvatarUrl = (seed: string) => {
        const hash = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${hash}`;
    };

    // Define the activity event type
    type ActivityEvent = {
        id: string;
        user: string;
        action: string;
        time: string;
    };

    // Get activity events with proper typing
    const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);

    // Fetch activity data from the database
    useEffect(() => {
        const fetchCardActivity = async () => {
            try {
                // In a real implementation, this would call an API endpoint
                // to fetch actual activity for this card from the database
                // For now we'll use just created/updated timestamps for minimal data
                const events: ActivityEvent[] = [
                    {
                        id: "created",
                        user: "System",
                        action: "created this card",
                        time: new Date(card.createdAt).toLocaleString(),
                    }
                ];

                if (card.updatedAt && card.createdAt.toString() !== card.updatedAt.toString()) {
                    events.push({
                        id: "updated",
                        user: "System",
                        action: "updated this card",
                        time: new Date(card.updatedAt).toLocaleString(),
                    });
                }

                setActivityEvents(events);
            } catch (error) {
                console.error("Failed to fetch card activity:", error);
            }
        };

        fetchCardActivity();
    }, [card.createdAt, card.updatedAt]);

    // Get priority options
    const priorityOptions = [
        { value: "high", label: "High", color: "bg-red-500" },
        { value: "medium", label: "Medium", color: "bg-orange-500" },
        { value: "low", label: "Low", color: "bg-blue-500" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex justify-between items-center">
                    <div className="flex items-center gap-x-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <DialogTitle className="text-sm text-muted-foreground">
                            Card {card.id.substring(0, 8)}
                        </DialogTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {/* Left column - Card details */}
                    <div className="col-span-1 md:col-span-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-6">
                                    {/* Card title */}
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel className="text-lg font-semibold">Title</FormLabel>
                                                    {!isEditing && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setIsEditing(true)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                </div>
                                                <FormControl>
                                                    {isEditing ? (
                                                        <Input
                                                            {...field}
                                                            ref={titleRef}
                                                            placeholder="Enter card title"
                                                            className="w-full text-lg font-medium"
                                                        />
                                                    ) : (
                                                        <div className="text-lg font-medium py-2">
                                                            {field.value}
                                                        </div>
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Tabs for card details */}
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className="grid grid-cols-3">
                                            <TabsTrigger value="details">
                                                <AlignLeft className="h-4 w-4 mr-2" />
                                                Details
                                            </TabsTrigger>
                                            <TabsTrigger value="activity">
                                                <History className="h-4 w-4 mr-2" />
                                                Activity
                                            </TabsTrigger>
                                        </TabsList>

                                        {/* Details Tab */}
                                        <TabsContent value="details" className="space-y-4 py-4">
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            {isEditing ? (
                                                                <Textarea
                                                                    {...field}
                                                                    placeholder="Add a more detailed description..."
                                                                    className="min-h-32 resize-y w-full"
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="bg-slate-50 p-3 rounded-md min-h-32 whitespace-pre-wrap"
                                                                    onClick={() => setIsEditing(true)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            setIsEditing(true);
                                                                        }
                                                                    }}
                                                                >
                                                                    {field.value || "Click to add a description..."}
                                                                </div>
                                                            )}
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* List location */}
                                            <div className="text-sm">
                                                <p className="text-muted-foreground">
                                                    In list: <span className="font-medium">{card?.list?.title}</span>
                                                </p>
                                            </div>

                                            {/* Created and updated dates */}
                                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-x-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Created: {new Date(card.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-x-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Updated: {new Date(card.updatedAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* Activity Tab */}
                                        <TabsContent value="activity" className="space-y-4 py-4">
                                            <h3 className="font-medium">Activity History</h3>
                                            <div className="space-y-4">
                                                {activityEvents.length > 0 ?
                                                    activityEvents.map((event) => (
                                                        <div key={event.id} className="flex items-start gap-x-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback>{getInitials(event.user)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <p className="text-sm">
                                                                    <span className="font-medium">{event.user}</span>
                                                                    {" "}
                                                                    {event.action}
                                                                </p>
                                                                <span className="text-xs text-muted-foreground">{event.time}</span>
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <div className="flex flex-col items-center justify-center py-4">
                                                            <p className="text-muted-foreground text-sm">No activity found for this card.</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>

                                {isEditing && (
                                    <div className="flex gap-x-2">
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-24"
                                        >
                                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                form.reset({
                                                    title: card.title,
                                                    description: card.description || ""
                                                });
                                                setIsEditing(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </Form>
                    </div>

                    {/* Right column - Sidebar */}
                    <div className="col-span-1 space-y-6">

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Actions</h3>
                            <div className="space-y-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleCopy}
                                    disabled={isCopying}
                                >
                                    {isCopying ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Copy className="h-4 w-4 mr-2" />
                                    )}
                                    {isCopying ? "Copying..." : "Copy Card"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Trash className="h-4 w-4 mr-2" />
                                    )}
                                    {isDeleting ? "Deleting..." : "Delete Card"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CardModal;