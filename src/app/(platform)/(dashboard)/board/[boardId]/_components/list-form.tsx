"use client";

import { Button } from "@/components/ui/button";
import ListWrapper from "./list-wrapper";
import { Plus, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams, useRouter } from "next/navigation";
import { listFormSchema, type ListFormSchema } from "@/schemas/list.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createList } from "@/actions/list/create-list";
import FormTextInput from "@/components/global/form-text-input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ListForm = () => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { boardId } = useParams();

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const disableEditing = () => {
        setIsEditing(false);
        reset();
    };

    // Close when Escape is pressed globally
    useEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") disableEditing();
    });

    // Close on click outside of the form
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<ListFormSchema>({
        resolver: zodResolver(listFormSchema),
        defaultValues: {
            title: "",
            boardId: boardId as string,
        },
    });

    const onSubmit = async (data: ListFormSchema) => {
        setIsSubmitting(true);
        try {
            const result = await createList(data);
            if (!result.success) {
                setError("root", { message: result.message });
                toast.error("Failed to create list");
                return;
            }
            toast.success(`List "${data.title}" created successfully`);
            reset();

            // Option 1: Keep the form open for creating multiple lists
            inputRef.current?.focus();

            // Option 2: Close the form after creating a list
            // disableEditing();

            router.refresh();
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to generate a placeholder title suggestion
    const getListSuggestion = () => {
        const suggestions = [
            "To Do",
            "In Progress",
            "In Review",
            "Done",
            "Backlog",
            "Planning",
            "Ready for Development",
            "Testing",
            "Blocked",
            "Deployment Ready"
        ];

        // Return a random suggestion
        return suggestions[Math.floor(Math.random() * suggestions.length)];
    };

    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    ref={formRef}
                    className="w-full bg-white p-3 rounded-md space-y-4 shadow-md"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="text-sm font-medium mb-2 text-neutral-700">
                        Add a new list
                    </div>

                    <FormTextInput
                        control={control}
                        name="title"
                        ref={inputRef}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") disableEditing();
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(onSubmit)();
                            }
                        }}
                        className="w-full text-sm px-2 py-1.5 font-medium border-input focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
                        placeholder={`Try "${getListSuggestion()}"...`}
                    />

                    <input
                        type="hidden"
                        value={boardId as string}
                        {...control.register("boardId")}
                    />

                    {errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                    {errors.boardId && (
                        <p className="text-sm text-red-500">{errors.boardId.message}</p>
                    )}
                    {errors.root && (
                        <p className="text-sm text-red-500">{errors.root.message}</p>
                    )}

                    <div className="flex items-center gap-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "w-full transition-all duration-300 flex items-center justify-center gap-2",
                                isSubmitting && "opacity-70"
                            )}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            <span>{isSubmitting ? "Creating..." : "Add List"}</span>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={disableEditing}
                            className="w-auto transition-all duration-300"
                            disabled={isSubmitting}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        );
    }

    return (
        <ListWrapper>
            <Button
                type="button"
                className="w-full h-12 transition-all duration-300 flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-muted-foreground hover:text-foreground border border-dashed border-neutral-300"
                variant="ghost"
                onClick={enableEditing}
            >
                <Plus className="w-4 h-4" />
                <span>Add another list</span>
            </Button>
        </ListWrapper>
    );
};

export default ListForm;