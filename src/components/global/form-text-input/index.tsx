import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import type { Control } from "react-hook-form";
import { useFormContext } from "react-hook-form";

interface FormTextInputProps extends React.ComponentProps<"input"> {
    label?: string;
    description?: string;
    className?: string;
    name: string;
    control?: Control<any>;
}

const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps>(
    ({ className, type, label, description, name, control, ...props }, ref) => {
        const formContext = useFormContext();
        const { register } = control || formContext;

        return (
            <FormItem className={className}>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input
                        type={type}
                        className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        placeholder={props.placeholder || "Enter text..."}
                        {...register(name)}
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

export default FormTextInput;