'use client'
import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FormButtonProps extends ButtonProps {
    className?: string
    children?: React.ReactNode
    isPending?: boolean
}

const FormButton = ({
    children,
    className,
    isPending = false,
    disabled = false,
    ...props
}: FormButtonProps) => {
    const buttonClasses = cn(
        'bg-primary hover:bg-primary/90 text-primary-foreground transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
    )

    return (
        <Button
            className={buttonClasses}
            disabled={disabled || isPending}
            {...props}
        >
            {isPending ? (
                <>{children} <span className="ml-2">Submitting...</span></>
            ) : (
                children
            )}
        </Button>
    )
}

export default FormButton
