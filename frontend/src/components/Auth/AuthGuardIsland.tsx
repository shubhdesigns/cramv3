import React, { useEffect } from "react";
import { useUser } from "./UserProvider";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuardIsland: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, onboardingComplete } = useUser();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = "/signin";
      } else if (!onboardingComplete) {
        window.location.href = "/onboarding";
      }
    }
  }, [user, loading, onboardingComplete]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-accent1-light dark:border-accent1-dark border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="font-heading text-accent1-light dark:text-accent1-dark">Loading...</span>
      </div>
    );
  }

  // If user is not signed in or not onboarded, useEffect will redirect
  return <>{children}</>;
};

export default AuthGuardIsland;
