import React, { createContext, useContext, useEffect, useState } from "react";
import { useFirebase } from "../../firebase/init";

interface UserContextType {
  user: any;
  loading: boolean;
  onboardingComplete: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  onboardingComplete: false,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [firebaseModule, setFirebaseModule] = useState<any>(null);

  // Initialize Firebase when component mounts
  useEffect(() => {
    useFirebase((module) => {
      setFirebaseModule(module);
    });
  }, []);

  useEffect(() => {
    if (!firebaseModule) return;
    
    const unsubscribe = firebaseModule.onAuthStateChanged((firebaseUser: any) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser && firebaseModule.db) {
        try {
          firebaseModule.firestore.getDoc(
            firebaseModule.firestore.doc(firebaseModule.db, "users", firebaseUser.uid)
          ).then((userDoc: any) => {
            setOnboardingComplete(!!userDoc.data()?.onboardingComplete);
          }).catch((error: any) => {
            console.error("Error fetching user data:", error);
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setOnboardingComplete(false);
      }
    });
    return () => unsubscribe();
  }, [firebaseModule]);

  return (
    <UserContext.Provider value={{ user, loading, onboardingComplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 