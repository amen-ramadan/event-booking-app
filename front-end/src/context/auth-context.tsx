import React from "react";

type AuthContextType = {
  token: string | null;
  userId: string | null;
  username: string | null;
  login: (username: string, userToken: string, loginUserId: string) => void;
  logout: () => void;
};

const AuthContext: React.Context<AuthContextType> =
  React.createContext<AuthContextType>({
    token: null,
    userId: null,
    username: null,
    login: () => {},
    logout: () => {},
  });

export default AuthContext;
