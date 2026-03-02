import { createContext, useContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  // Simple auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate login/logout (you can replace with real API later)
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access AuthContext
export function useAuth() {
  return useContext(AuthContext);
}