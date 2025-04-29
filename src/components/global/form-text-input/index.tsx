import { forwardRef } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface FormTextInputProps<T extends FieldValues> extends React.ComponentProps<"input"> {
    label?: string;
    description?: string;
    className?: string;
    name: Path<T>;
    control: Control<T>;
    error?: string;
}

const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps<any>>(
    ({ className, type, label, description, name, control, error, ...props }, ref) => {
        const { field, fieldState } = useController({
            name,
            control,
        });

        return (
            <div className={`space-y-2 ${className}`}>
                {label && (
                    <label
                        htmlFor={name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                )}
                <Input
                    {...field}
                    {...props}
                    id={name}
                    ref={ref}
                    type={type}
                    className={`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${props.className || ""}`}
                    placeholder={props.placeholder || "Enter text..."}
                    aria-invalid={!!fieldState.error}
                />
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
                {(fieldState.error || error) && (
                    <p className="text-xs text-destructive">
                        {fieldState.error?.message || error}
                    </p>
                )}
            </div>
        );
    }
);

FormTextInput.displayName = "FormTextInput";

export default FormTextInput;