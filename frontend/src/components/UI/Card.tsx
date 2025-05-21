import * as React from "react";
import { cn } from "../../utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ header, footer, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark p-6",
          className
        )}
        {...props}
      >
        {header && (
          <div className="mb-4 font-heading text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            {header}
          </div>
        )}
        <div className="font-body text-base text-text-primary-light dark:text-text-primary-dark">
          {children}
        </div>
        {footer && (
          <div className="mt-4 border-t border-border-light dark:border-border-dark pt-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {footer}
          </div>
        )}
      </div>
    );
  }
);
Card.displayName = "Card";

export { Card }; 