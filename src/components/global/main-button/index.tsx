import React from 'react'
import { Button } from '@/components/ui/button'
import type { ButtonVariantProps } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface MainButtonProps extends ButtonVariantProps {
  href?: string
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'ghost' | 'link' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const MainButton = ({
  children,
  href,
  className,
  variant = 'default',
  size = 'default',
  ...props
}: MainButtonProps) => {
  const buttonClasses = cn(
    'bg-primary hover:bg-primary/90 text-primary-foreground transition-colors',
    className
  )

  if (href) {
    return (
      <Button
        className={buttonClasses}
        variant={variant}
        size={size}
        asChild
        {...props}
      >
        <Link href={href}>{children}</Link>
      </Button>
    )
  }

  return (
    <Button
      className={buttonClasses}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  )
}

export default MainButton
