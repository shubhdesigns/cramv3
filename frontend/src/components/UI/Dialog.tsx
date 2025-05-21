import React, { useEffect, useRef } from "react";

interface DialogProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Dialog({ onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-xl max-w-md w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-xl text-error-light dark:text-error-dark font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>
        <h2 className="font-heading text-xl font-semibold mb-4 text-accent1-light dark:text-accent1-dark">{title}</h2>
        {children}
      </div>
    </div>
  );
} 