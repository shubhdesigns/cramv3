import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-base font-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent1-light dark:focus-visible:ring-accent1-dark focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md",
  {
    variants: {
      variant: {
        accent1:
          "bg-accent1-light text-white dark:bg-accent1-dark dark:text-white hover:bg-accent1-light/90 dark:hover:bg-accent1-dark/90",
        accent2:
          "bg-accent2-light text-white dark:bg-accent2-dark dark:text-slate-900 hover:bg-accent2-light/90 dark:hover:bg-accent2-dark/90",
        success:
          "bg-success-light text-white dark:bg-success-dark dark:text-white hover:bg-success-light/90 dark:hover:bg-success-dark/90",
        error:
          "bg-error-light text-white dark:bg-error-dark dark:text-white hover:bg-error-light/90 dark:hover:bg-error-dark/90",
        info:
          "bg-info-light text-white dark:bg-info-dark dark:text-white hover:bg-info-light/90 dark:hover:bg-info-dark/90",
        outline:
          "border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark hover:bg-accent2-light/10 dark:hover:bg-accent2-dark/10",
        ghost:
          "bg-transparent hover:bg-accent2-light/20 dark:hover:bg-accent2-dark/20 text-accent1-light dark:text-accent1-dark",
        link:
          "bg-transparent underline text-accent1-light dark:text-accent1-dark hover:text-accent2-light dark:hover:text-accent2-dark px-0 py-0 shadow-none",
      },
      size: {
        default: "h-11 px-6 py-2 text-base",
        sm: "h-9 px-4 py-1.5 text-sm",
        lg: "h-14 px-8 py-3 text-lg",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "accent1",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
