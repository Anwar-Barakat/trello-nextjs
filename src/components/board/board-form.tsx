'use client';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useBoardForm } from '@/hooks/board/useBoardForm';
import FormTextInput from '@/components/global/form-text-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import GlobalTooltip from '@/components/global/tooltip';
import { FREE_BOARD_LIMIT, FREE_BOARD_LIMIT_HINT, FREE_BOARD_LIMIT_REMAINING } from '@/constants/free.constants';
import { memo } from 'react';

/**
 * Board creation form component
 */
const BoardForm = () => {
    const { form, onSubmit, errors, isSubmitting, isOpen, setIsOpen } = useBoardForm();

    const formErrors = form.formState.errors;
    const hasFormErrors = Object.keys(formErrors).length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        if (hasFormErrors) {
            e.preventDefault();
            form.trigger();
            return;
        }
        form.handleSubmit(onSubmit)(e);

    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
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
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Board</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormTextInput
                            control={form.control}
                            name="title"
                            label="Board Title"
                            placeholder="Enter board title..."
                            disabled={isSubmitting}
                            className="bg-background"
                        />


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