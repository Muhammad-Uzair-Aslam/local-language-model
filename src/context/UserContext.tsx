import React, { createContext, useContext, useState } from 'react';

interface UserContextProps {
  userInfo: any; // Use your specific type instead of any if possible
  setUserInfo: (user: any) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  const logout = () => {
    console.log('User logged out from context');
    setUserInfo(null);
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
