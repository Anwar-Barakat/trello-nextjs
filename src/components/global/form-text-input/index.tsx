import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import type { Control } from "react-hook-form";

interface FormTextInputProps extends React.ComponentProps<"input"> {
    label?: string;
    description?: string;
    className?: string;
    name: string;
    control: Control<any>;
}

const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps>(
    ({ className, type, label, description, name, control, ...props }, ref) => {
        return (
            <FormField
                control={control}
                name={name}
                render={({ field, fieldState }) => (
                    <FormItem className={className}>
                        {label && <FormLabel>{label}</FormLabel>}
                        <FormControl>
                            <Input
                                {...field}
                                type={type}
                                className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                placeholder={props.placeholder || "Enter text..."}
                                disabled={props.disabled}
                                ref={ref}
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

FormTextInput.displayName = "FormTextInput";

export default FormTextInput;