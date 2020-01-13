import React, { useState, useCallback, useEffect } from "react";

import MainNavigation from "./Shared/Components/Navigation/MainNavigation";
import Users from "./Users/Pages/Users";
import UserPlaces from "./Places/Pages/UserPlaces";
import NewPlace from "./Places/Pages/NewPlace";
import UpdatePlace from "./Places/Pages/UpdatePlace";
import Authentication from "./Users/Pages/Auth";
import { AuthContext } from "./Shared/Context/auth-context";
import { Route, Redirect, Switch } from "react-router-dom";

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
    //save data in Local storage
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData"); //remove token
  }, []);

  //autologin. If some data in local storage, do login.
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route exact path="/" component={Users} />
        <Route exact path="/:userId/places" component={UserPlaces} />
        <Route exact path="/places/new" component={NewPlace} />
        <Route exact path="/places/:placeId" component={UpdatePlace} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" component={Users} />
        <Route exact path="/:userId/places" component={UserPlaces} />
        <Route exact path="/auth" component={Authentication} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          login: login,
          logout: logout
        }}
      >
        <MainNavigation />
        <main>{routes}</main>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
