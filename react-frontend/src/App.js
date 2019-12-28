import React, { useState, useCallback } from "react";

import MainNavigation from "./Shared/Components/Navigation/MainNavigation";
import Users from "./Users/Pages/Users";
import UserPlaces from "./Places/Pages/UserPlaces";
import NewPlace from "./Places/Pages/NewPlace";
import UpdatePlace from "./Places/Pages/UpdatePlace";
import Authentication from "./Users/Pages/Auth";
import { AuthContext } from "./Shared/Context/auth-context";
import { Route, Redirect, Switch } from "react-router-dom";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback(uid => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;
  if (isLoggedIn) {
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
          isLoggedIn: isLoggedIn,
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
