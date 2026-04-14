"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UserRole } from "@/types/database";

interface UserContextType {
  currentUser: UserRole | null;
  setCurrentUser: (role: UserRole | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isLoading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("what2eat_user");
    if (stored === "adrian" || stored === "janina") {
      setCurrentUserState(stored);
    }
    setIsLoading(false);
  }, []);

  function setCurrentUser(role: UserRole | null) {
    setCurrentUserState(role);
    if (role) {
      localStorage.setItem("what2eat_user", role);
    } else {
      localStorage.removeItem("what2eat_user");
    }
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
