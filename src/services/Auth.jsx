import React, { useContext, createContext, useState } from "react";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  AuthProvider.setAuth = setAuth;
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
