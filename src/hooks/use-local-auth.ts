import { useCallback, useEffect, useState } from "react";

interface LocalUser {
  email: string;
  id: string;
}

// Example credentials for testing
const DEMO_EMAIL = "admin@example.com";
const DEMO_PASSWORD = "password123";

export function useLocalAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedAuth = localStorage.getItem("adminAuth");
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        setUser(auth);
      } catch (e) {
        localStorage.removeItem("adminAuth");
      }
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    // Simple validation - check against demo credentials
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const newUser: LocalUser = {
        email,
        id: "admin-user-" + Date.now(),
      };
      setUser(newUser);
      localStorage.setItem("adminAuth", JSON.stringify(newUser));
    } else {
      throw new Error("Invalid email or password");
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem("adminAuth");
  }, []);

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
