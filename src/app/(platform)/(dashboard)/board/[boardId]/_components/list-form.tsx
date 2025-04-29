"use client";

import { Button } from "@/components/ui/button";
import ListWrapper from "./list-wrapper";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams } from "next/navigation";
import { listFormSchema, type ListFormSchema } from "@/schemas/list.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createList } from "@/actions/list/create-list";
import FormTextInput from "@/components/global/form-text-input";
import { useForm } from "react-hook-form";

const ListForm = () => {
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { boardId } = useParams();

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
        const result = await createList(data);
        if (!result.success) { 
            setError("root", { message: result.message });
            return;
        }
        reset();
        disableEditing();
    };

    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    ref={formRef}
                    className="w-full bg-white p-3 rounded-md space-y-4 shadow-md"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <FormTextInput
                        control={control}
                        name="title"
                        ref={inputRef}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") disableEditing();
                        }}
                        className="w-full text-sm px-2 py-1.5 font-medium border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter a list title..."
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
                            className="w-full transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add List</span>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full transition-all duration-300 flex items-center justify-center gap-2"
                            onClick={disableEditing}
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
                className="w-full transition-all duration-300 flex items-center justify-center gap-2"
                onClick={enableEditing}
            >
                <Plus className="w-4 h-4" />
                <span>Add List</span>
            </Button>
        </ListWrapper>
    );
};

export default ListForm;