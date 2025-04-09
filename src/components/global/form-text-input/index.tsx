import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface FormTextInputProps extends React.ComponentProps<"input"> {
    label?: string;
    description?: string;
} 

const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps>(
    ({ className, type, label, description, ...props }, ref) => {
        return (
            <FormItem className={className}>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input
                        type={type}
                        ref={ref}
                        className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        placeholder={props.placeholder || "Enter text..."}
                        {...props}
                    />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage className="text-xs" />
            </FormItem>
        );
    }
);

FormTextInput.displayName = "FormTextInput";

export { FormTextInput };
