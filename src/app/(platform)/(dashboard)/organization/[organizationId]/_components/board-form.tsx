'use client'

import React, { useState } from 'react'
import { boardDefaultValues, boardFormSchema, type BoardFormSchema } from '../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { createBoard } from '../actions/create-board';
import { FormTextInput } from '@/components/global';
import { useRouter } from 'next/navigation';
import useBoardStore from '../stores/board.store';

const BoardForm = () => {
    const router = useRouter();
    const { isLoading, setIsLoading, boards, setBoards } = useBoardStore();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<BoardFormSchema>({
        resolver: zodResolver(boardFormSchema),
        defaultValues: boardDefaultValues
    });

    const onSubmit = async (data: BoardFormSchema) => {
        try {
            setError(null);
            setIsLoading(true);

            const newBoard = await createBoard(data);

            if (newBoard.id) {
                setBoards([...boards, newBoard]);
                form.reset();
                router.refresh();
            }
        } catch (err) {
            console.error("Error creating board:", err);
            setError("Failed to create board. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormTextInput
                    control={form.control}
                    name="title"
                    label="Board Title"
                    placeholder="Enter board title..."
                />

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Board'}
                </Button>
            </form>
        </Form>
    )
}

export default BoardForm