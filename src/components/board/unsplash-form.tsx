"use client";

import { UNSPLASH_COLLECTION_ID, UNSPLASH_IMAGE_COUNT } from "@/constants/unsplash.constants";
import { cn } from "@/lib/utils";
import type { UnsplashImage } from "@/stores/slices/unsplash-slice";
import useUnsplashStore from "@/stores/unsplash.store";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useUnsplashImages } from "@/hooks/unsplash/useUnsplashImages";

interface UnsplashFormProps {
    id: string;
    errors: Record<string, string[] | undefined>;
}

export const UnsplashForm = ({ id, errors }: UnsplashFormProps) => {
    const { selectedImageId, setSelectedImageId } = useUnsplashStore();
    const { images, isLoading, error, refetch } = useUnsplashImages();
    const { pending } = useFormStatus();

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
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (!images || images.length === 0) {
        return (
            <div className="text-gray-500 p-2 text-center">
                No images available. Please try again.
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-4">
                {images?.length > 0 && images?.map((image) => (
                    <button
                        key={image.id}
                        type="button"
                        className={cn(
                            "relative h-24 w-full rounded-md overflow-hidden cursor-pointer transition-all",
                            selectedImageId === image.id && "ring-2 ring-blue-500 scale-105",
                            pending && 'opacity-50 pointer-events-none'
                        )}
                        onClick={() => {
                            if (pending) return;
                            setSelectedImageId(image.id);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !pending) {
                                setSelectedImageId(image.id);
                            }
                        }}
                        aria-label={`Select image by ${image.user.name}`}
                        aria-pressed={selectedImageId === image.id}
                    >
                        <Image
                            src={image.urls.small}
                            alt={`Photo by ${image.user.name}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {selectedImageId === image.id && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                <div className="bg-white p-1 rounded-full">
                                    <Check className="h-4 w-4 text-blue-500" />
                                </div>
                            </div>
                        )}
                    </button>
                ))}
            </div>
            <input
                type="hidden"
                name={id}
                value={selectedImageId || ""}
            />
            {errors?.[id] && (
                <div className="text-red-500 text-sm mt-2">
                    {errors[id]?.join(", ")}
                </div>
            )}
        </div>
    );
};