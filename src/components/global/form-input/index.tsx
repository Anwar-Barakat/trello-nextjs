"use client";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

interface FormInputProps extends React.ComponentProps<"input"> {
    name: string;
    label?: string;
    description?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ className, type, name, label, description, ...props }, ref) => {
        const { control } = useFormContext();

        return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className={className}>
                        {label && <FormLabel>{label}</FormLabel>}
                        <FormControl>
                            <Input
                                type={type}
                                className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                placeholder={props.placeholder || "Enter value..."}
                                {...field}
                                {...props}
                            />
                        </FormControl>
                        {description && <FormDescription>{description}</FormDescription>}
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
        );
    }
);

FormInput.displayName = "FormInput";

export { FormInput };
