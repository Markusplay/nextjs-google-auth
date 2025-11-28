"use client";

import React, { useState, useEffect, createContext, ReactNode } from "react";
import { firebaseAuth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";

interface GlobalContextType {
  loggedInUser: User | null;
  authLoading: boolean;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [user, authLoading, authError] = useAuthState(firebaseAuth);

  useEffect(() => {
    authError && console.error("authError", authError);
  }, [authError]);

  useEffect(() => {
    if (user && user.uid) {
      setLoggedInUser(user);
    } else {
      setLoggedInUser(null);
    }
  }, [user]);

  return (
    <GlobalContext.Provider value={{ loggedInUser, authLoading }}>
      {children}
    </GlobalContext.Provider>
  );
}
