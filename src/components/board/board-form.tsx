'use client';

import React, { memo } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useBoardForm } from '@/hooks/board/useBoardForm';
import { FormTextInput } from '@/components/global';

/**
 * Board creation form component
 */
const BoardForm = () => {
    const { form, onSubmit, error, isSubmitting } = useBoardForm();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormTextInput
                    control={form.control}
                    name="title"
                    label="Board Title"
                    placeholder="Enter board title..."
                    disabled={isSubmitting}
                />

                {error && (
                    <div className="text-sm text-red-500">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                >
                    {isSubmitting ? 'Creating...' : 'Create Board'}
                </Button>
            </form>
        </Form>
    );
};

export default memo(BoardForm);