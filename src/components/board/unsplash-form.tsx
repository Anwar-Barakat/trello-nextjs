"use client";

import { cn } from "@/lib/utils";
import useUnsplashStore from "@/stores/unsplash.store";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useUnsplashImages } from "@/hooks/unsplash/useUnsplashImages";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { FALLBACK_UNSPLASH_IMAGES } from "@/constants/unsplash.constants";

interface UnsplashFormProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
    disabled?: boolean;
}

export const UnsplashForm = ({ id, errors, disabled }: UnsplashFormProps) => {
    const { selectedImageId, setSelectedImageId } = useUnsplashStore();
    const { images, isLoading, error, refetch } = useUnsplashImages();
    const { pending } = useFormStatus();
    const form = useFormContext();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-24">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-2 text-center">
                {error}
                <Button
                    type="button"
                    onClick={refetch}
                    className="ml-2 underline text-blue-500"
                    disabled={disabled}
                >
                    Retry
                </Button>
            </div>
        );
    }

    const displayImages = images?.length > 0 ? images : FALLBACK_UNSPLASH_IMAGES;

    if (!displayImages || displayImages.length === 0) {
        return (
            <div className="text-gray-500 p-2 text-center">
                No images available. Please try again.
            </div>
        );
    }

    return (
        <FormField
            control={form.control}
            name={id}
            disabled={disabled}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Board Background</FormLabel>
                    <div className="grid grid-cols-3 gap-4">
                        {displayImages.map((image) => (
                            <button
                                key={image.id}
                                type="button"
                                disabled={disabled}
                                className={cn(
                                    "relative h-24 w-full rounded-md overflow-hidden cursor-pointer transition-all",
                                    field.value === image.id && "ring-2 ring-primary ring-offset-2",
                                    pending && 'opacity-50 pointer-events-none'
                                )}
                                onClick={() => {
                                    if (pending) return;
                                    field.onChange(image.id);
                                    setSelectedImageId(image.id);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !pending) {
                                        field.onChange(image.id);
                                        setSelectedImageId(image.id);
                                    }
                                }}
                                aria-label={`Select image by ${image.user.name}`}
                                aria-pressed={field.value === image.id}
                            >
                                <Image
                                    src={image.urls.small}
                                    alt={`Photo by ${image.user.name}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                {field.value === image.id && (
                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                        <div className="bg-white p-1 rounded-full">
                                            <Check className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Select an image for your board background
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};