import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import type { AuthUser } from "@aws-amplify/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  signOut: async () => {},
  getToken: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error checking auth state:", error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getToken = async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signOut: handleSignOut, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
