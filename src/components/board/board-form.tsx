'use client';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useBoardForm } from '@/hooks/board/useBoardForm';
import FormTextInput from '@/components/global/form-text-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import GlobalTooltip from '@/components/global/tooltip';
import { FREE_BOARD_LIMIT, FREE_BOARD_LIMIT_HINT, FREE_BOARD_LIMIT_REMAINING } from '@/constants/free.constants';
import { memo, type ReactNode } from 'react';
import { UnsplashForm } from './unsplash-form';

/**
 * Board creation form component
 */
const BoardForm = ({ trigger }: { trigger?: ReactNode }) => {
    const { form, onSubmit, errors, isSubmitting, isOpen, setIsOpen } = useBoardForm();

    const formErrors = form.formState.errors;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)(e);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setIsOpen(true);
                            }
                        }}
                        className="w-full"
                    >
                        {trigger}
                    </button>
                ) : (
                    <Button
                        variant="outline"
                        className="w-auto w-fit border-2 border-dashed hover:border-primary/50 transition-colors"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="flex items-center gap-2 w-fit">
                            <PlusCircle className="h-5 w-5 text-primary" />
                            <span>Create New Board</span>
                        </div>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create New Board</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <UnsplashForm id="image" />

                        <FormTextInput
                            control={form.control}
                            name="title"
                            label="Board Title"
                            placeholder="Enter board title..."
                            disabled={isSubmitting}
                            className="bg-background"
                        />

                        {errors.length > 0 && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                {errors.map((error) => (
                                    <p key={error}>{error}</p>
                                ))}
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
            </DialogContent>
        </Dialog>
    );
};

export default memo(BoardForm);