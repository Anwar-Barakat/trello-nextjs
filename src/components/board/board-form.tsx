'use client';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useBoardForm } from '@/hooks/board/useBoardForm';
import FormTextInput from '@/components/global/form-text-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import GlobalTooltip from '@/components/global/tooltip';
import { FREE_BOARD_LIMIT, FREE_BOARD_LIMIT_HINT, FREE_BOARD_LIMIT_REMAINING } from '@/constants/free.constants';
import { memo, useEffect } from 'react';
import { UnsplashForm } from './unsplash-form';
import useBoardStore from '@/stores/board.store';

type BoardFormProps = {
    availableCount: number;
    hasAvailableCount: boolean;
}


const BoardForm = ({ availableCount, hasAvailableCount }: BoardFormProps) => {
    console.log('availableCount', availableCount);
    console.log('hasAvailableCount', hasAvailableCount);
    const { form, onSubmit, errors, isSubmitting } = useBoardForm();
    const { isOpenModal, setIsOpenModal, setAvailableCount, availableCount: availableCountStore } = useBoardStore();

    useEffect(() => {
        setAvailableCount(availableCount);
    }, [availableCount, setAvailableCount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)(e);
    };

    return (
        <>
            <Button
                variant="outline"
                className="w-auto w-fit border-2 border-dashed hover:border-primary/50 transition-colors"
                onClick={() => setIsOpenModal(true)}
            >
                <div className="flex items-center gap-2 w-fit">
                    <PlusCircle className="h-5 w-5 text-primary" />
                    <span>Create New Board</span>
                </div>
            </Button>
            <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create New Board</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <UnsplashForm id="image" disabled={!hasAvailableCount} />

                            <FormTextInput
                                control={form.control}
                                name="title"
                                label="Board Title"
                                placeholder="Enter board title..."
                                disabled={isSubmitting || !hasAvailableCount}
                                className="bg-background"
                            />

                            {
                                !hasAvailableCount && (
                                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                        <p>You have reached the maximum number of boards</p>
                                    </div>
                                )
                            }

                            <div className="flex items-center justify-between">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !hasAvailableCount}
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
                                        <span>({availableCountStore}) Remaining</span>
                                    </span>
                                </GlobalTooltip>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default memo(BoardForm);