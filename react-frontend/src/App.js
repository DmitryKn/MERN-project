import React, { useState, useCallback, useEffect, Suspense } from "react";

import MainNavigation from "./Shared/Components/Navigation/MainNavigation";
//import Users from "./Users/Pages/Users";
//import UserPlaces from "./Places/Pages/UserPlaces";
//import NewPlace from "./Places/Pages/NewPlace";
//import UpdatePlace from "./Places/Pages/UpdatePlace";
//import Authentication from "./Users/Pages/Auth";
import { AuthContext } from "./Shared/Context/auth-context";
import { Route, Redirect, Switch } from "react-router-dom";
import LoadingSpinner from "./Shared/Components/UIElements/LoadingSpinner";

//lazy load content for routing + wrapping routes with <Suspense>
const Users = React.lazy(() => import("./Users/Pages/Users"));
const UserPlaces = React.lazy(() => import("./Places/Pages/UserPlaces"));
const NewPlace = React.lazy(() => import("./Places/Pages/NewPlace"));
const UpdatePlace = React.lazy(() => import("./Places/Pages/UpdatePlace"));
const Authentication = React.lazy(() => import("./Users/Pages/Auth"));

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    // 1 hour auto-logout
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    //save data in Local storage
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData"); //remove token
  }, []);

  //autologout
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //autologin. If some data in local storage, do login.
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
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
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
