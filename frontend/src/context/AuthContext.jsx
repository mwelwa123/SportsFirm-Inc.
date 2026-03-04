// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, getToken, setToken, removeToken } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load — restore session from localStorage
  useEffect(() => {
    const token = getToken();
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setIsAuthenticated(true);
    setUser(data.user);
    return data;
  };

  const register = async (full_name, email, password) => {
    const data = await authAPI.register(full_name, email, password);
    return data;
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
