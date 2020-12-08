import React, { useContext, createContext, useState } from "react";
import { logIn } from "./EP";

const AuthContext = createContext(
  JSON.parse(localStorage.getItem("user")) ?? {}
);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem("user")) ?? {}
  );
  AuthProvider.auth = (login, pwd) => {
    return logIn(login, pwd).then((data) => {
      if (data.error) {
        throw "";
      }
      localStorage.setItem("user", JSON.stringify(data));
      setAuth(data);
      return data;
    });
  };
  AuthProvider.logoff = () => {
    localStorage.removeItem("user");
    setAuth({});
  };
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
