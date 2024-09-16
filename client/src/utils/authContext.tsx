import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the User type
interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  // Load user info from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    console.log('Loaded user from localStorage:', savedUser);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('Parsed user from localStorage:', parsedUser);
      setUser(parsedUser);
    }
  }, []);
  
  useEffect(() => {
    console.log('Token changed:', token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);
  
  useEffect(() => {
    console.log('User changed:', user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
