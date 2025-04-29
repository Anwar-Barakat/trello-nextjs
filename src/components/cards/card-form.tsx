"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormTextInput from "@/components/global/form-text-input";
import { createCard } from "@/actions/card/create-card";
import { cardFormSchema, type CardFormSchema } from "@/schemas/card.schema";

interface CardFormProps {
    listId: string;
    onClose: () => void;
}

const CardForm = ({ listId, onClose }: CardFormProps) => {
    const params = useParams();
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<CardFormSchema>({
        resolver: zodResolver(cardFormSchema),
        defaultValues: {
            title: "",
            listId: listId,
        },
    });

    // Close when Escape is pressed globally
    useEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    });

    // Close on click outside of the form
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, onClose);

    const onSubmit = async (data: CardFormSchema) => {
        const result = await createCard(data);

        if (!result.success) {
            setError("root", { message: result.message });
            return;
        }

        // Reset form and keep it open to add multiple cards
        reset({ title: "", listId: listId });

        // Optional: close the form on success
        // onClose();
    };

    return (
        <form
            ref={formRef}
            className="m-1 py-0.5 px-1 space-y-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <FormTextInput
                control={control}
                name="title"
                ref={inputRef}
                className="w-full text-sm px-2 py-1.5 bg-white rounded-md shadow-sm border border-input"
                placeholder="Enter a title for this card..."
            />
            <input type="hidden" value={listId} {...control.register("listId")} />

            {errors.root && (
                <p className="text-sm text-red-500">{errors.root.message}</p>
            )}

            <div className="flex items-center gap-x-1">
                <Button
                    type="submit"
                    size="sm"
                    className="h-7 px-2 text-xs"
                >
                    Add card
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={onClose}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
        </form>
    );
};

export default CardForm;