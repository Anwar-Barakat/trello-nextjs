'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionIcon?: React.ReactNode;
    onAction?: () => void;
    imageUrl?: string;
}

/**
 * Empty state component for when there's no data
 */
const EmptyState = ({
    title,
    description,
    actionLabel,
    actionIcon,
    onAction,
    imageUrl,
}: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
            {imageUrl && (
                <div className="relative h-32 w-32 mb-2">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-contain opacity-80"
                    />
                </div>
            )}

            <h3 className="text-lg font-medium">{title}</h3>

            <p className="text-muted-foreground max-w-md">
                {description}
            </p>

            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    className="mt-4"
                >
                    {actionIcon && <span className="mr-2">{actionIcon}</span>}
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;