import React, { createContext, useContext, useState, useEffect } from "react";
import { adminService } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("admin_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const adminUser = { ...userData, role: "ADMIN" };
    setUser(adminUser);
    localStorage.setItem("admin_user", JSON.stringify(adminUser));
    if (token) {
      localStorage.setItem("admin_token", token);
    }
  };

  const logout = () => {
    adminService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
