'use client';

import React, { memo } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useBoardForm } from '@/hooks/board/useBoardForm';
import { FormTextInput } from '@/components/global';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import GlobalTooltip from '@/components/global/tooltip';
import { FREE_BOARD_LIMIT, FREE_BOARD_LIMIT_HINT, FREE_BOARD_LIMIT_REMAINING } from '@/constants/free.constants';

/**
 * Board creation form component
 */
const BoardForm = () => {
    const { form, onSubmit, error, isSubmitting } = useBoardForm();

    return (
        <Card className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <PlusCircle className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Create New Board</h3>
                        </div>

                        <FormTextInput
                            control={form.control}
                            name="title"
                            label="Board Title"
                            placeholder="Enter board title..."
                            disabled={isSubmitting}
                            className="bg-background"
                        />

                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Board'}
                            </Button>
                            <GlobalTooltip 
                                content={FREE_BOARD_LIMIT}
                                hint={FREE_BOARD_LIMIT_HINT}
                            >
                                <span className="text-sm text-muted-foreground font-medium cursor-help">
                                    <span>({FREE_BOARD_LIMIT_REMAINING})</span>
                                </span>
                            </GlobalTooltip>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default memo(BoardForm);