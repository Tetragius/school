import React, { useContext, createContext, useState } from "react";
import { db } from "../App";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  AuthProvider.auth = (login, pwd) =>
    db.auth(login, pwd).then((data) => {
      setAuth(data);
      return data;
    });
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
