import React from "react";

interface LogoProps {
  withIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
};

export const Logo: React.FC<LogoProps> = ({ withIcon = true, size = "md", className = "" }) => {
  return (
    <span className={`inline-flex items-center gap-2 font-heading font-bold ${sizeMap[size]} ${className}`}>
      {withIcon && (
        <span className="rounded-full bg-accent2-light dark:bg-accent2-dark p-1 shadow-md">
          <span className="text-2xl align-middle">🧠⏰</span>
        </span>
      )}
      <span className="tracking-tight text-accent1-light dark:text-accent1-dark">Cram</span>
      <span className="tracking-tight text-accent2-light dark:text-accent2-dark">time</span>
    </span>
  );
}; 