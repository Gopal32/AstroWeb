"use client";

import useApi from "@/hooks/useApi";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { apiCall } = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await apiCall("/api/user/info", "GET");

      if (res?.statusCode === 200) {
        const userData = Array.isArray(res?.data)
          ? res.data[0]
          : res?.data;

        setUser(userData || null);

      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);