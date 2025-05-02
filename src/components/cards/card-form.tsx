"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Loader2, Tag, AlignLeft, User, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FormTextInput from "@/components/global/form-text-input";
import { createCard } from "@/actions/card/create-card";
import { cardFormSchema, type CardFormSchema } from "@/schemas/card.schema";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Card } from "@prisma/client";

interface CardFormProps {
    listId: string;
    onClose: () => void;
    onCardCreated?: (card: Card) => void;
}

const CardForm = ({ listId, onClose, onCardCreated }: CardFormProps) => {
    const router = useRouter();
    const params = useParams();
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [showExtendedOptions, setShowExtendedOptions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        register,
        watch,
    } = useForm<CardFormSchema>({
        resolver: zodResolver(cardFormSchema),
        defaultValues: {
            title: "",
            listId: listId,
            description: "",
        },
    });

    // Close when Escape is pressed globally
    useEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    });

    // Close on click outside of the form
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, onClose);

    const toggleExtendedOptions = () => {
        setShowExtendedOptions(!showExtendedOptions);
        // Focus the description input when opening extended options
        if (!showExtendedOptions) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };

    const onSubmit = async (data: CardFormSchema) => {
        setIsSubmitting(true);
        try {
            const result = await createCard(data);

            if (!result.success) {
                setError("root", { message: result.message });
                toast.error("Failed to create card");
                return;
            }

            toast.success("Card created successfully");

            // Reset form and keep it open to add multiple cards
            reset({ title: "", listId: listId, description: "" });
            setShowExtendedOptions(false);

            // Call the onCardCreated callback if provided
            if (onCardCreated && result.data) {
                onCardCreated(result.data);
            } else {
                // Fallback to router refresh if no callback provided
                router.refresh();
            }

            // Return focus to title input
            setTimeout(() => {
                const titleInput = document.querySelector('textarea[name="title"]') as HTMLTextAreaElement;
                titleInput?.focus();
            }, 100);
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Generate random card title placeholder
    const getCardTitlePlaceholder = () => {
        const placeholders = [
            "Add a task...",
            "Describe the next steps...",
            "What needs to be done?",
            "Add user story...",
            "Create new feature...",
            "Fix bug...",
            "Implement feature...",
            "Add a card title..."
        ];
        return placeholders[Math.floor(Math.random() * placeholders.length)];
    };

    return (
        <form
            ref={formRef}
            className="bg-white rounded-md shadow-md space-y-4 overflow-hidden"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="p-3 space-y-3">
                {/* Card Title Input */}
                <Textarea
                    {...register("title")}
                    placeholder={getCardTitlePlaceholder()}
                    className="w-full text-sm resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1 py-1.5 min-h-[60px]"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(onSubmit)();
                        }
                    }}
                />

                {errors.title && (
                    <p className="text-xs text-red-500 px-1">{errors.title.message}</p>
                )}

                {/* Hidden List ID */}
                <input type="hidden" value={listId} {...register("listId")} />

                {/* Extended Options (Description, Labels, etc.) */}
                {showExtendedOptions && (
                    <div className="space-y-3 border-t pt-3">
                        <div>
                            <Textarea
                                {...register("description")}
                                ref={inputRef}
                                placeholder="Add a more detailed description..."
                                className="w-full text-sm resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1 py-1.5 bg-slate-50 min-h-[80px]"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 px-1">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Form Error Messages */}
                {errors.root && (
                    <p className="text-xs text-red-500 px-1">{errors.root.message}</p>
                )}
            </div>

            {/* Form Actions */}
            <div className="bg-slate-50 px-3 py-2 flex items-center justify-between border-t">
                <div className="flex gap-1">
                    <Button
                        type="submit"
                        size="sm"
                        className={cn(
                            "h-8 px-3 text-xs font-medium",
                            isSubmitting && "opacity-70"
                        )}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Plus className="h-3 w-3 mr-1" />
                                Add Card
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>

                <div className="flex gap-1">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={toggleExtendedOptions}
                        disabled={isSubmitting}
                    >
                        <AlignLeft className="h-3 w-3" />
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={isSubmitting}
                    >
                        <User className="h-3 w-3" />
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={isSubmitting}
                    >
                        <Tag className="h-3 w-3" />
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={isSubmitting}
                    >
                        <Clock className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default CardForm;