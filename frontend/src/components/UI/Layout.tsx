import React from "react";
import { Logo } from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "./Button";
import SearchBar from "./SearchBar";
import UserMenuIsland from "../UserMenuIsland";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-lg bg-background-light/80 dark:bg-background-dark/80 border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="hidden md:block">
              <SearchBar />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <UserMenuIsland />
          </div>
        </div>
        <div className="md:hidden container mx-auto px-4 pb-2">
          <SearchBar />
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      {/* Footer */}
      <footer className="px-6 py-4 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
        &copy; {new Date().getFullYear()} Cramtime. All rights reserved.
      </footer>
    </div>
  );
}; 