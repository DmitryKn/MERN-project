import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
});

/*
  1) create Context

  Обветрка в Аpp
  2) add {myContext} to App
  3) wrap with <myContext.Provider value={}> all elements + {useState} + create functions to use

  В компонентах где нам необходимо использовать стейт:
  4) add { useContext } + {myContext}
    const varName = useContext(myContext);

    return
    {varName.myProp && <button> }

  */
