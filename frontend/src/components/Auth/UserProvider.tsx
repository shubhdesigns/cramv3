import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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
  const [db, setDb] = useState<any>(null);
  const [firebaseModule, setFirebaseModule] = useState<any>(null);

  // Initialize Firebase when component mounts
  useEffect(() => {
    useFirebase((module) => {
      setFirebaseModule(module);
      if (module.app) {
        setDb(getFirestore(module.app));
      }
    });
  }, []);

  useEffect(() => {
    if (!firebaseModule) return;
    
    const unsubscribe = firebaseModule.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser && db) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          setOnboardingComplete(!!userDoc.data()?.onboardingComplete);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setOnboardingComplete(false);
      }
    });
    return () => unsubscribe();
  }, [db, firebaseModule]);

  return (
    <UserContext.Provider value={{ user, loading, onboardingComplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 