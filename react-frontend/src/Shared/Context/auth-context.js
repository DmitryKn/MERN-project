import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
});

/*
  1) create Context
  2) add {AuthContext} to App
  3) wrap with <AuthContext.Provider value={}> all elements + it is good to use  {useState}
  4) add {AuthContext} to component where need state + { useContext } for listening state
    const auth = useContext(AuthContext);

  */
