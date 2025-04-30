"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface ListWrapperProps extends React.HTMLAttributes<HTMLLIElement> {
    children: React.ReactNode;
    isCompact?: boolean;
    className?: string;
}

const listVariants = cva(
    "shrink-0 h-full select-none transition-all duration-200 ease-in-out",
    {
        variants: {
            size: {
                default: "basis-80 w-[272px]",
                compact: "basis-64 w-[240px]",
                expanded: "basis-96 w-[320px]"
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
);

const ListWrapper = forwardRef<HTMLLIElement, ListWrapperProps>(
    ({ children, isCompact = false, className, ...props }, ref) => {
        return (
            <li
                ref={ref}
                className={cn(
                    listVariants({ size: isCompact ? "compact" : "default" }),
                    className
                )}
                {...props}
            >
                {children}
            </li>
        );
    }
);

ListWrapper.displayName = "ListWrapper";

export default ListWrapper;