"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        getIdToken(user).then(token => {
          Cookies.set('__session', token, { path: '/', expires: 7 });
        });
      } else {
        Cookies.remove('__session', { path: '/' });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}