import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../firebase/init';

export default function AuthGuardIsland() {
  const navigate = useNavigate();
  const [firebaseModule, setFirebaseModule] = useState<any>(null);

  useEffect(() => {
    useFirebase((module) => {
      setFirebaseModule(module);
    });
  }, []);

  useEffect(() => {
    if (!firebaseModule) return;

    const unsubscribe = firebaseModule.onAuthStateChanged((user) => {
      if (user) {
        // Redirect to dashboard if user is authenticated
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate, firebaseModule]);

  return null;
}
