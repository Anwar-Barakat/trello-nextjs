'use client'

import React from 'react'
import { boardDefaultValues, boardFormSchema, type BoardFormSchema } from '../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/global/form-input';
import { Button } from '@/components/ui/button';
import { createBoard } from '../actions/create-board';

const BoardForm = () => {
    const form = useForm<BoardFormSchema>({
        resolver: zodResolver(boardFormSchema),
        defaultValues: boardDefaultValues
    });

    const onSubmit = async (data: BoardFormSchema) => {
        try {
            await createBoard(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                    name="title"
                    label="Board Title"
                    placeholder="Enter board title..."
                />

                <Button type="submit">
                    Create Board
                </Button>
            </form>
        </Form>
    )
}

export default BoardForm
